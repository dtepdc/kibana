/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { Container } from 'unstated';
import { CMPopulatedBeat } from './../../common/domain_types';
import { BeatsTagAssignment } from './../../server/lib/adapters/beats/adapter_types';
import { FrontendLibs } from './../lib/types';

interface ContainerState {
  list: CMPopulatedBeat[];
}

export class BeatsContainer extends Container<ContainerState> {
  private query?: string;
  constructor(private readonly libs: FrontendLibs) {
    super();
    this.state = {
      list: [],
    };
  }

  public getBeatWithToken = async (token: string) => {
    const beat = await this.libs.beats.getBeatWithToken(token);

    if (beat) {
      this.setState({
        list: [beat as CMPopulatedBeat, ...this.state.list],
      });
      return beat as CMPopulatedBeat;
    }
    return null;
  };

  public reload = async (kuery?: string) => {
    if (kuery) {
      this.query = await this.libs.elasticsearch.convertKueryToEsQuery(kuery);
    } else {
      this.query = undefined;
    }
    const beats = await this.libs.beats.getAll(this.query);

    this.setState({
      list: beats,
    });
  };

  public deactivate = async (beats: CMPopulatedBeat[]) => {
    for (const beat of beats) {
      await this.libs.beats.update(beat.id, { active: false });
    }

    // because the compile code above has a very minor race condition, we wait,
    // the max race condition time is really 10ms but doing 100 to be safe
    setTimeout(async () => {
      await this.reload(this.query);
    }, 100);
  };

  public toggleTagAssignment = async (tagId: string, beats: CMPopulatedBeat[]) => {
    if (beats.some(beat => beat.full_tags.some(({ id }) => id === tagId))) {
      await this.removeTagsFromBeats(beats, tagId);
      return 'removed';
    }
    await this.assignTagsToBeats(beats, tagId);
    return 'added';
  };

  public removeTagsFromBeats = async (beats: CMPopulatedBeat[] | string[], tagId: string) => {
    if (!beats.length) {
      return false;
    }
    const assignments = createBeatTagAssignments(beats, tagId);
    await this.libs.beats.removeTagsFromBeats(assignments);
    await this.reload(this.query);
  };

  public assignTagsToBeats = async (beats: CMPopulatedBeat[] | string[], tagId: string) => {
    if (!beats.length) {
      return false;
    }
    const assignments = createBeatTagAssignments(beats, tagId);
    await this.libs.beats.assignTagsToBeats(assignments);
    await this.reload(this.query);
  };
}

function createBeatTagAssignments(
  beats: CMPopulatedBeat[] | string[],
  tagId: string
): BeatsTagAssignment[] {
  if (typeof beats[0] === 'string') {
    return (beats as string[]).map(id => ({ beatId: id, tag: tagId }));
  } else {
    return (beats as CMPopulatedBeat[]).map(({ id }) => ({ beatId: id, tag: tagId }));
  }
}

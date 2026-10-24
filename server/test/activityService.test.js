import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  claimPassingAssessmentCompletion,
  claimQuestCompletion,
  getActivityDate,
  getCompletionDetails,
  isActivityDate,
  summarizeCompletions,
} from '../src/services/activityService.js';

let mongo;
let Progress;

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  const schema = new mongoose.Schema({
    userId: String,
    planId: String,
    completedNodeIds: [String],
    completionEvents: [{
      nodeId: String,
      nodeTitle: String,
      roadmapName: String,
      completedAt: Date,
    }],
  });
  Progress = mongoose.model('ActivityTestProgress', schema);
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

async function createProgress(completedNodeIds = []) {
  return Progress.create({
    userId: 'test-user',
    planId: `plan-${Math.random()}`,
    completedNodeIds,
    completionEvents: [],
  });
}

const completion = (record, nodeId = 'node-1') => ({
  userId: record.userId,
  planId: record.planId,
  nodeId,
  nodeTitle: 'Quest',
  roadmapName: 'Roadmap',
  completedAt: new Date('2025-01-01T18:30:00.000Z'),
});

describe('quest activity tracking', () => {
  it('counts a manual completion followed by a passing assessment once', async () => {
    const record = await createProgress();
    await claimQuestCompletion(Progress, completion(record));
    const assessmentClaim = await claimPassingAssessmentCompletion(
      Progress,
      completion(record),
      true,
    );
    const saved = await Progress.findById(record._id);
    assert.equal(assessmentClaim, null);
    assert.equal(saved.completionEvents.length, 1);
    assert.deepEqual(saved.completedNodeIds, ['node-1']);
  });

  it('allows only one concurrent claim for a user, plan, and node', async () => {
    const record = await createProgress();
    const claims = await Promise.all(Array.from({ length: 12 }, (_, index) =>
      index % 2 === 0
        ? claimQuestCompletion(Progress, completion(record))
        : claimPassingAssessmentCompletion(Progress, completion(record), true),
    ));
    const saved = await Progress.findById(record._id);
    assert.equal(claims.filter(Boolean).length, 1);
    assert.equal(saved.completionEvents.length, 1);
  });

  it('does not count skipped nodes or failed assessments', async () => {
    const record = await createProgress(['skipped-node']);
    const skippedClaim = await claimQuestCompletion(
      Progress,
      completion(record, 'skipped-node'),
    );
    const failedClaim = await claimPassingAssessmentCompletion(
      Progress,
      completion(record, 'failed-node'),
      false,
    );
    const saved = await Progress.findById(record._id);
    assert.equal(skippedClaim, null);
    assert.equal(failedClaim, null);
    assert.equal(saved.completionEvents.length, 0);
  });

  it('returns honest empty activity with no details', () => {
    assert.deepEqual(summarizeCompletions([]), []);
    assert.deepEqual(getCompletionDetails([], '2025-01-02'), []);
  });

  it('groups timestamps by Asia/Kolkata calendar date', async () => {
    const record = await createProgress();
    await claimQuestCompletion(Progress, completion(record));
    const saved = await Progress.findById(record._id);
    assert.equal(getActivityDate(new Date('2025-01-01T18:30:00.000Z')), '2025-01-02');
    assert.deepEqual(summarizeCompletions([saved]), [{ date: '2025-01-02', count: 1 }]);
    assert.equal(getCompletionDetails([saved], '2025-01-02').length, 1);
    assert.equal(getCompletionDetails([saved], '2025-01-01').length, 0);
  });

  it('rejects invalid calendar dates', () => {
    assert.equal(isActivityDate('2025-02-28'), true);
    assert.equal(isActivityDate('2025-02-30'), false);
    assert.equal(isActivityDate('2025-2-03'), false);
  });
});

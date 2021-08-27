import { TrainerModule } from './trainer.module';

describe('TrainerModule', () => {
  let trainerModule: TrainerModule;

  beforeEach(() => {
    trainerModule = new TrainerModule();
  });

  it('should create an instance', () => {
    expect(trainerModule).toBeTruthy();
  });
});

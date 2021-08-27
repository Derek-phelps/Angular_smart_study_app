import { PositionModule } from './position.module';

describe('PositionModule', () => {
  let positionModule: PositionModule;

  beforeEach(() => {
    positionModule = new PositionModule();
  });

  it('should create an instance', () => {
    expect(positionModule).toBeTruthy();
  });
});

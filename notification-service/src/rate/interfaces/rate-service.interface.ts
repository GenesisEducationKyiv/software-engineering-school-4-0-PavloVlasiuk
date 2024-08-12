import { UpdateRateDto } from '../dto';
import { Rate } from '../schemas';

export const RATE_SERVICE = 'RateService';

export interface IRateService {
  createCurrent(data: UpdateRateDto): Promise<void>;
  getLatest(): Promise<Rate>;
}

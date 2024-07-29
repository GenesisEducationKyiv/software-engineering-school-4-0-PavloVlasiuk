import { UpdateRateDto } from '../dto';

export const RATE_SERVICE = 'RateService';

export interface IRateService {
  createCurrent(data: UpdateRateDto): Promise<void>;
}

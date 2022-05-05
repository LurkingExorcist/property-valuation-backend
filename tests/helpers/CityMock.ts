import { Injectable } from '@decorators/di';

import City from '@/domain/cities/City.model';
import CityService from '@/domain/cities/City.service';

@Injectable()
export default class CityMock {
  private city: City;
  private cityService: CityService = new CityService();

  public getCity() {
    return this.city;
  }

  public async init() {
    this.city = await this.cityService.create({
      name: 'Test',
      region: 'Test',
    });
  }

  public async clear() {
    await this.cityService.remove({
      id: this.city.id,
    });
  }
}

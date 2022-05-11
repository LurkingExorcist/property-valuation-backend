import { Injectable } from '@decorators/di';
import faker from '@faker-js/faker';

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
    this.city = await this.loadCity();
  }

  public loadCity() {
    return this.cityService.create({
      name: faker.address.city(),
      region: faker.address.state(),
    });
  }

  public async clear() {
    await this.removeCity(this.city);
  }

  private async removeCity(city: City) {
    await this.cityService.remove({
      id: city.id,
    });
  }
}

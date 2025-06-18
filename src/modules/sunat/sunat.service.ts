import { Injectable } from '@nestjs/common';
import { firstValueFrom, map, timer } from 'rxjs';

@Injectable()
export class SunatService {

  public async methodValidateRucIsValid(ruc: string): Promise<boolean> {
    return firstValueFrom(timer(5000).pipe(map(() => false)))
  }

}

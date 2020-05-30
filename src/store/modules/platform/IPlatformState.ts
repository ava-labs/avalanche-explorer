import { IValidator, IValidatorData } from './IValidator';

export interface IPlatformState {
    validators: IValidator[]
    validatorsPending: IValidatorData[]
}

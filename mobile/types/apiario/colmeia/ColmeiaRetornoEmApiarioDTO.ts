import { StatusColmeia } from './Enums';

export interface ColmeiaRetornoEmApiarioDTO {
    id: number;
    identificador: string;
    statusColmeia: StatusColmeia;
}

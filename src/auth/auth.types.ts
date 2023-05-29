// ========== Auth Types
// import all modules
import mongoose from 'mongoose';
import { User } from '../schemas/user.schema';
import { RegisterDto } from './dto';
import { IResponse } from 'src/types';

export interface IUser extends User {
	_id?: mongoose.Types.ObjectId;
}

export interface IRegisterTest {
	body: Partial<RegisterDto>;
	message: string;
	result: IResponse<Partial<IUser>>;
}

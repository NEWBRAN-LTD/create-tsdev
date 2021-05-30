import 'reflect-metadata';
import { Connection } from 'typeorm';
declare const connection: Promise<Connection>;
export default connection;

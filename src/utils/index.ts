import Toolbox from './toolbox';
import APIError from './apiError';
import logger from '../configs/logger';
import BaseError from './baseError';

const Tools = new Toolbox();

export default Tools;

export { APIError, BaseError, logger };

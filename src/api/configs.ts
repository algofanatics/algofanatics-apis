import axios from 'axios';
import { env } from '../config';

const { CORE_URL, CORE_API_KEY } = env;

/***
 * axios configuration calls
 * depending on the call invoked, an axios instance is created
 * to enable ease of use of api across the codebase
 *
 * APIs:
 * 1. authenticator - for authenticator API calls
 *
 */

const configs = {
  authenticator() {
    const api = axios.create({
      baseURL: CORE_URL,
      headers: {
        Authorization: `Bearer ${CORE_API_KEY}`,
      },
    });

    return api;
  },
};

export default configs;

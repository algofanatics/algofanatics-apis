import APIConfigs from './configs';

const api = APIConfigs.authenticator();

async function sample(payload: any) {
  try {
    const response = await api.post('/', payload);
    return {
      apiResponseCode: '00',
      message: 'retrieved data successfully',
      status: 200,
      details: response,
    };
  } catch (error: any) {
    const message = error.response
      ? error.response?.data?.responseMessage
      : 'Credit Bureau CRC Network Error';
    const status = error.response ? error.response.status : 'fail';
    const apiResponseCode = error.response ? error.response.responseCode : '01';
    return {
      apiResponseCode,
      message,
      status,
    };
  }
}

export default sample;

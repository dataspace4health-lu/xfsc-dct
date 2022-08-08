import axios from 'axios';
import { Message } from 'primereact/message';
import React from 'react';
import Button from '../../components/form/button';
import styles from './register-page.module.scss';
import cx from 'classnames';

interface ResponseProof {
  type?: string;
  proofPurpose?: string;
  verificationMethod?: string;
  jws?: string;
}
const axiosInstance = axios.create();

const RegisterPage = () => {
  const [contractJson, setContractJson] = React.useState({});
  const [responseJson, setResponseJson] = React.useState<ResponseProof>({});
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleSubmit = async (event: any) => {
    try {
      const baseUrl = process.env.NX_API_ENDPOINT;
      const authToken = process.env.TOKEN;
      event.preventDefault();
      const response = await axiosInstance.post(baseUrl + '/register', contractJson, {
        headers: {
          'Content-Type': 'application/ld+json',
          'Accept-Version': 1,
          Accept: 'application/ld+json',
          Authorization: 'Bearer ' + authToken,
        },
      });
      if (response.status === 201) {
        setSuccess(`${response.status} ${response.statusText}`);
        setError('');
        const responseData = {
          type: response.data.proof.type,
          proofPurpose: response.data.proof.proofPurpose,
          verificationMethod: response.data.proof.verificationMethod,
          jws: response.data.proof.jws,
        };
        setResponseJson(responseData);
        setContractJson({});
      } else {
        setSuccess('');
        setResponseJson({});
        setError('Something went wrong.');
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const errorText = JSON.parse(e.request.responseText);
        setError(`Error ${errorText.statusCode}: ${errorText.message}`);
        setResponseJson({});
      } else {
        setResponseJson({});
        setError('Something went wrong.');
      }
      setSuccess('');
    }
  };

  return (
    <>
      <div className="text-center mb-4">
        <div className="text-900 text-3xl font-medium mb-2">Register Contract</div>
        <span className="text-600 font-medium">Insert Contract Data to continue with the registration</span>
      </div>
      <div className="w-full md:w-10 mx-auto">
        <form className="p-fluid">
          <textarea
            rows={15}
            placeholder="Contract Data JSON"
            className="textInputForm w-full p-3"
            onChange={(e) => setContractJson(e.target.value)}
          />
          {success !== '' && <Message className="mx-auto w-full my-2" severity="success" text={success} />}
          <div className={cx('m-0', 'py-2', 'px-4', styles.registerResponse)}>
            {!responseJson.type && error !== '' && (
              <Message className="mx-auto w-full my-2" severity="error" text={error} />
            )}
            {responseJson.type && <div>{`Type: ${JSON.stringify(responseJson.type)}`}</div>}
            {responseJson.proofPurpose && <div>{`Purpose: ${JSON.stringify(responseJson.proofPurpose)}`}</div>}
            {responseJson.verificationMethod && (
              <div>{`Verification Method: ${JSON.stringify(responseJson.verificationMethod)}`}</div>
            )}
            {responseJson.jws && <div>{`JWT: ${JSON.stringify(responseJson.jws)}`}</div>}
          </div>

          <Button onClick={handleSubmit} label="Register Contract" type="submit" className="w-full p-3 text-xl" />
        </form>
      </div>
    </>
  );
};

export default RegisterPage;

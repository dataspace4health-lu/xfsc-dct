import axios from 'axios';
import { Message } from 'primereact/message';
import React from 'react';
import Button from '../../components/form/button';

const RegisterPage = () => {
  const [contractJson, setContractJson] = React.useState({});
  const [error, setError] = React.useState('');

  const handleSubmit = async (event: any) => {
    try {
      console.log(contractJson);
      const response = await axios.post('http://localhost:3000/register', contractJson);
      console.log(response);
    } catch (e) {
      setError(`Error: ${e}`);
    }
  };

  return (
    <>
      <div className="text-center mb-5">
        <div className="text-900 text-3xl font-medium mb-3">Register Contract</div>
        <span className="text-600 font-medium">Insert Contract Data to continue with the registration</span>
      </div>
      {error && <Message severity="error" text={error} />}
      <div className="w-full md:w-10 mx-auto">
        <form className="p-fluid">
          <textarea
            rows={20}
            placeholder="Contract Data JSON"
            className="textInputForm w-full p-3"
            onChange={(e) => setContractJson(e.target.value)}
          />
          <Button onClick={handleSubmit} label="Register Contract" type="submit" className="w-full p-3 text-xl" />
        </form>
      </div>
    </>
  );
};

export default RegisterPage;

import React from 'react';
import Button from '../../components/form/button';
import TextInput from '../../components/form/text-input';

const RegisterPage = () => {
  return (
    <>
      <div className="text-center mb-5">
        <div className="text-900 text-3xl font-medium mb-3">
          Register Contract
        </div>
        <span className="text-600 font-medium">
          Insert Contract Data to continue with the registration
        </span>
      </div>
      <div className="w-full md:w-10 mx-auto">
        <form className="p-fluid">
          <textarea
            rows={20}
            placeholder="Contract Data JSON"
            className="textInputForm w-full p-3"
          />
          <Button
            label="Register Contract"
            type="submit"
            className="w-full p-3 text-xl"
          />
        </form>
      </div>
    </>
  );
};

export default RegisterPage;

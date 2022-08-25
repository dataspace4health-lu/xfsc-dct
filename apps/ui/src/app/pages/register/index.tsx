import cx from 'classnames';
import { Message } from 'primereact/message';
import React from 'react';
import { JSONTree } from 'react-json-tree';
import Button from '../../components/form/button';
import { useRegisterMutation } from '../../redux/apis/dct.api';
import styles from './register-page.module.scss';


const RegisterPage = () => {
  const [contractJson, setContractJson] = React.useState('');
  const [register, { error, data, isLoading }] = useRegisterMutation();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    register(JSON.parse(contractJson));
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

          {(data || error) && <div className={cx('m-0', 'py-2', 'px-4', styles.registerResponse)}>
            {data && <JSONTree
              data={data}
              hideRoot
              theme={{
                scheme: 'monokai',
                base00: '#272822',
                base01: '#383830',
                base02: '#49483e',
                base03: '#75715e',
                base04: '#a59f85',
                base05: '#f8f8f2',
                base06: '#f5f4f1',
                base07: '#f9f8f5',
                base08: '#f92672',
                base09: '#fd971f',
                base0A: '#f4bf75',
                base0B: '#a6e22e',
                base0C: '#a1efe4',
                base0D: '#66d9ef',
                base0E: '#ae81ff',
                base0F: '#cc6633',
              }}
            />}
            {error && (
              <Message className="mx-auto w-full my-2" severity="error" text={error.message} />
            )}
          </div>}

          <Button onClick={handleSubmit} label="Register Contract" type="submit" className="w-full p-3 text-xl" loading={isLoading} />
        </form>
      </div>
    </>
  );
};

export default RegisterPage;

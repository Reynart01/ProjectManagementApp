import React, { useState } from 'react';

import { registerSteps } from '.';

import { Stepper, Step, Text } from 'shared/ui';

import Credentials from './forms/credentials/Credentials';

import classes from './Register.scss';

const Register = () => {
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const step = registerSteps[activeStepIdx];

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Text variant="title">{step.title}</Text>
        <Text variant="subTitle">{step.subTitle}</Text>
        <Stepper step={activeStepIdx} onStepChange={setActiveStepIdx}>
          {registerSteps.map(step => (
            <Step key={step.title} title={step.title}>
              <path d={step.path} />
            </Step>
          ))}
        </Stepper>
        <Credentials
          formConfig={step.formConfig}
          onFormSubmit={() => console.log('siema')}
        />
      </div>
    </div>
  );
};

export default Register;

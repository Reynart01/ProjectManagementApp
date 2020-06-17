import React, { useCallback, useContext, useEffect } from 'react';

import { Button } from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';

import { CheckboxProps, Select } from 'shared/ui';

import { useForm, FormSubmitEvent } from 'shared/forms';

import { throttle } from 'shared/utils';

import { TechnologiesContext } from 'core/technologies';

import { TemplatesSearchProps, searchFormConfig } from '.';

import csx from './TemplatesSearch.scss';

export const TemplatesSearch = ({ onSubmit }: TemplatesSearchProps) => {
  const { technologies } = useContext(TechnologiesContext);

  const [{ fields }, change, directChange, submit] = useForm(searchFormConfig);

  const setTechnologiesSelection = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, value: boolean) => {
      const id = +e.currentTarget.getAttribute('data-id');
      const mappedTechnologies: CheckboxProps[] = fields[1].value.map((item: CheckboxProps) =>
        id === item.dataId
          ? {
              ...item,
              value
            }
          : item
      );

      directChange([1], [mappedTechnologies]);
    },
    [fields]
  );

  const throttledOnSubmit = useCallback(throttle(onSubmit, 500), []);

  const handleSubmit = useCallback(
    (e: FormSubmitEvent) => {
      const isInvalid = submit(e);

      if (isInvalid) {
        return;
      }

      throttledOnSubmit(fields[0].value);
    },
    [fields]
  );

  useEffect(() => {
    const mappedTechnologies: CheckboxProps[] = technologies.map(({ id, name }) => ({
      dataId: id,
      label: name,
      value: false
    }));

    directChange([1], [mappedTechnologies]);
  }, [technologies]);

  return (
    <form className={csx.templatesSearch} onSubmit={handleSubmit}>
      <input
        data-idx={0}
        placeholder="Find your template..."
        className={csx.input}
        value={fields[0].value}
        onChange={change}
      />

      <Select
        label="Technologies *"
        placeholder="All technologies"
        className={csx.select}
        openClass={csx.selectMenuOpen}
        items={fields[1].value}
        onSelect={setTechnologiesSelection}
      />

      <Button type="submit" className={csx.confirmSearchBtn}>
        <SearchIcon />
      </Button>
    </form>
  );
};

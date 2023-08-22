/*
 *  Copyright 2023 LiteFarm.org
 *  This file is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */
import PureSimpleCustomType from '../../../components/Forms/SimpleCustomType';
import { HookFormPersistProvider } from '../../hooks/useHookFormPersist/HookFormPersistProvider';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
//TODO: make this saga
//import { addExpenseType } from '../saga';
import { CUSTOM_EXPENSE_NAME } from './constants';

function AddCustomExpense({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleGoBack = () => {
    history.back();
  };

  const onSubmit = (payload) => {
    // dispatch(addExpenseType(payload));
  };

  return (
    <HookFormPersistProvider>
      <PureSimpleCustomType
        handleGoBack={handleGoBack}
        onSubmit={onSubmit}
        view="add"
        buttonText={t('common:SAVE')}
        pageTitle={t('EXPENSE.ADD_EXPENSE.ADD_CUSTOM_EXPENSE')}
        inputLabel={t('EXPENSE.ADD_EXPENSE.CUSTOM_EXPENSE_NAME')}
        customTypeRegister={CUSTOM_EXPENSE_NAME}
      />
    </HookFormPersistProvider>
  );
}

export default AddCustomExpense;

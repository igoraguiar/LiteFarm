import { useState } from 'react';
import Button from '../../../Form/Button';
import { useTranslation } from 'react-i18next';
import RouterTab from '../../../RouterTab';
import PageTitle from '../../../PageTitle/v2';
import Input from '../../../Form/Input';
import ReactSelect from '../../../Form/ReactSelect';
import RetireSensorModal from '../../../Modals/RetireSensor';
import { useDispatch } from 'react-redux';
import {
  enqueueErrorSnackbar,
  enqueueSuccessSnackbar,
} from '../../../../containers/Snackbar/snackbarSlice';
import axios from 'axios';
import { getAccessToken } from '../../../../util/jwt';
import { sensorUrl } from '../../../../apiConfig';
import FilterPillSelect from '../../../Filter/FilterPillSelect';
import { container_planting_depth } from '../../../../util/convert-units/unit';
import Unit from '../../../Form/Unit';
import { useForm } from 'react-hook-form';

export default function PureSensorDetail({
  history,
  user,
  match,
  plan,
  system,
  filter,
  filterRef,
  tasksFilter,
}) {
  const isAdmin = user || true;
  const [showRetireModal, setShowRetireModal] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const brand_names = [
    {
      label: 'Ensemble Scientific',
      value: 'Ensemble',
      onClick: () => console.log('Reroute'),
    },
  ];
  const BRAND = 'Ensemble Scientific';
  const DEPTH = 'CHANGE';
  const DEPTH_UNIT = 'CHANGE';
  const EXTERNAL_IDENTIFIER = 'CHANGE';
  const HARDWARE_VERSION = 'CHANGE';
  const MODEL = 'CHANGE';
  const PART_NUMBER = 'CHANGE';
  const SENSOR_NAME = 'CHANGE';
  const LATITUDE = 'CHANGE';
  const LONGTITUDE = 'CHANGE';
  const READING_TYPES = 'CHANGE';
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      brand: 'ensemble_scientific',
      sensor_name: 'Input container data',
      latitude: '1',
      longtitude: '2',
      reading_types: '',
      external_identifier: 'Get container value',
    },
    shouldUnregister: false,
    mode: 'onChange',
  });
  console.log(setValue);

  // TODO: Use non-hardcoded values
  function onRetire() {
    axios
      .post(
        `${sensorUrl}/unclaim_sensor`,
        {
          org_id: '?',
          external_id: '?',
        },
        { headers: { Authorization: `Bearer ${getAccessToken()}` } },
      )
      .then(function (res) {
        console.log('success\n', res);
        dispatch(enqueueSuccessSnackbar(t('SENSOR.RETIRE.RETIRE_SUCCESS')));
      })
      .catch(function (error) {
        console.log('failure\n', error);
        dispatch(enqueueErrorSnackbar(t('SENSOR.RETIRE.RETIRE_FAILURE')));
      })
      .then(function () {
        history.push('/map');
      });
  }

  return (
    <div style={{ padding: '24px 16px 24px 16px' }}>
      <PageTitle
        title={'CHANGE'}
        onGoBack={() => history.onGoBack()}
        style={{ marginBottom: '24px', marginTop: '24px' }}
      />
      <RouterTab
        classes={{ container: { margin: '24px 0 24px 0' } }}
        history={history}
        tabs={[
          {
            label: t('SENSOR.VIEW_HEADER.READINGS'),
            path: `/`,
            state: location?.state,
          },
          {
            label: t('SENSOR.VIEW_HEADER.TASKS'),
            path: `/`,
            state: location?.state,
          },
          {
            label: t('SENSOR.VIEW_HEADER.DETAILS'),
            path: `/`,
            state: location?.state,
          },
        ]}
      />
      <Input
        label={t('SENSOR.DETAIL.NAME')}
        style={{ paddingBottom: '32px', paddingTop: '24px' }}
        disabled={true}
        value={'CHANGE'}
      />
      <div
        className={'latLong'}
        style={{
          flexDirection: 'row',
          display: 'inline-flex',
          paddingBottom: '32px',
          width: '100%',
          gap: '16px',
        }}
      >
        <Input
          label={t('SENSOR.DETAIL.LATITUDE')}
          disabled={true}
          value={LATITUDE}
          classes={{ container: { flexGrow: 1 } }}
        />
        <Input
          label={t('SENSOR.DETAIL.LONGITUDE')}
          disabled={true}
          value={LONGTITUDE}
          classes={{ container: { flexGrow: 1 } }}
        />
      </div>

      <div>
        <FilterPillSelect
          subject={filter.subject}
          options={filter.options}
          filterKey={filter.filterKey}
          style={{ marginBottom: '32px' }}
          filterRef={filterRef}
          key={filter.filterKey}
          isDisabled={true}
        />
      </div>

      <Unit
        register={register}
        defaultValue={DEPTH}
        label={t('SENSOR.DETAIL.DEPTH')}
        hookFormSetValue={setValue}
        hookFormGetValue={getValues}
        hookFromWatch={watch}
        name={'DEPTH'}
        displayUnitName={'DEPTH_UNIT'}
        unitType={container_planting_depth}
        max={10000}
        system={system}
        control={control}
        style={{ marginBottom: '40px' }}
        disabled={true}
      />

      <ReactSelect
        label={t('SENSOR.DETAIL.BRAND')}
        placeholder={BRAND}
        defaultValue={BRAND}
        isDisabled={true}
        options={brand_names}
        style={{ paddingBottom: '32px' }}
        toolTipContent={t('SENSOR.DETAIL.BRAND_TOOLTIP')}
      />

      <Input
        label={t('SENSOR.DETAIL.MODEL')}
        style={{ paddingBottom: '32px' }}
        disabled={true}
        optional={true}
        value={MODEL}
      />

      <Input
        label={t('SENSOR.DETAIL.EXTERNAL_IDENTIFIER')}
        style={{ paddingBottom: '32px' }}
        disabled={true}
        optional={true}
        toolTipContent={t('SENSOR.DETAIL.EXTERNAL_ID_TOOLTIP')}
        value={EXTERNAL_IDENTIFIER}
      />
      <Input
        label={t('SENSOR.DETAIL.PART_NUMBER')}
        style={{ paddingBottom: '32px' }}
        disabled={true}
        optional={true}
        value={PART_NUMBER}
      />
      <Input
        label={t('SENSOR.DETAIL.HARDWARE_VERSION')}
        style={{ paddingBottom: '32px' }}
        disabled={true}
        optional={true}
        value={HARDWARE_VERSION}
      />
      {isAdmin && (
        <div
          className={'buttonGroup'}
          style={{
            flexDirection: 'row',
            display: 'inline-flex',
            paddingBottom: '40px',
            width: '100%',
            gap: '16px',
          }}
        >
          <Button
            type={'submit'}
            onClick={() => setShowRetireModal(true)} // Change accordingly
            color={'secondary'}
            classes={{ container: { flexGrow: 1 } }}
          >
            {t(`SENSOR.DETAIL.RETIRE`)}
          </Button>

          <Button
            type={'submit'}
            onClick={() => history.push('/edit_sensor')} // Change accordingly
            classes={{ container: { flexGrow: 1 } }}
          >
            {t(`SENSOR.DETAIL.EDIT`)}
          </Button>
        </div>
      )}
      {showRetireModal && (
        <RetireSensorModal dismissModal={() => setShowRetireModal(false)} onRetire={onRetire} />
      )}
    </div>
  );
}

import {useCardPayment} from '@brutmaps/api';
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {type PayPalCardFieldsInstance, usePayPalSdk} from '~/hooks/usePayPalSdk.ts';
import styles from './CardFieldsForm.module.scss';

export interface CardFieldsFormHandle {
  submit: () => Promise<string>;
}

interface CardFieldsFormProps {
  onError: (message: string) => void;
}

const CardFieldsForm = forwardRef<CardFieldsFormHandle, CardFieldsFormProps>(({onError}, ref) => {
  const {t} = useTranslation();
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;
  const {paypal, error: sdkError} = usePayPalSdk(clientId);
  const {createOrder, captureOrder} = useCardPayment();

  const numberRef = useRef<HTMLDivElement>(null);
  const expiryRef = useRef<HTMLDivElement>(null);
  const cvvRef = useRef<HTMLDivElement>(null);
  const cardFieldsRef = useRef<PayPalCardFieldsInstance | null>(null);
  const approvedOrderId = useRef<string | null>(null);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (sdkError) onError(t('checkout.cardPaymentUnavailable'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkError]);

  useEffect(() => {
    if (!paypal || !numberRef.current || !expiryRef.current || !cvvRef.current) return;

    const cardFields = paypal.CardFields({
      createOrder: async () => {
        const orderId = await createOrder();
        approvedOrderId.current = null;
        return orderId;
      },
      onApprove: async (data) => {
        approvedOrderId.current = data.orderID;
      },
      onError: (error) => {
        onError(error instanceof Error ? error.message : t('checkout.cardPaymentFailed'));
      },
    });

    if (!cardFields.isEligible()) {
      onError(t('checkout.cardPaymentUnavailable'));
      return;
    }

    cardFields.NumberField({}).render(`#${numberRef.current.id}`);
    cardFields.ExpiryField({}).render(`#${expiryRef.current.id}`);
    cardFields.CVVField({}).render(`#${cvvRef.current.id}`);

    cardFieldsRef.current = cardFields;
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paypal]);

  useImperativeHandle(ref, () => ({
    submit: async () => {
      if (!cardFieldsRef.current) throw new Error(t('checkout.cardPaymentUnavailable'));

      await cardFieldsRef.current.submit();

      if (!approvedOrderId.current) throw new Error(t('checkout.cardPaymentFailed'));

      const {transactionId} = await captureOrder(approvedOrderId.current);
      return transactionId;
    },
  }));

  return (
    <div className={styles.wrapper}>
      <div className='form__fieldset'>
        <label>{t('checkout.cardNumber')}</label>
        <div id='paypal-card-number' ref={numberRef} className={styles.field} />
      </div>
      <div className={styles.row}>
        <div className='form__fieldset'>
          <label>{t('checkout.cardExpiry')}</label>
          <div id='paypal-card-expiry' ref={expiryRef} className={styles.field} />
        </div>
        <div className='form__fieldset'>
          <label>{t('checkout.cardCvv')}</label>
          <div id='paypal-card-cvv' ref={cvvRef} className={styles.field} />
        </div>
      </div>
      {!isReady && <p className={styles.loading}>{t('common.loading')}</p>}
    </div>
  );
});

CardFieldsForm.displayName = 'CardFieldsForm';

export default CardFieldsForm;

import {useCart, useCheckout, usePaymentGateways, useProfile} from '@brutmaps/api';
import {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import Button from '~/components/Button/Button.tsx';
import CardFieldsForm, {type CardFieldsFormHandle} from '~/components/CardFieldsForm/CardFieldsForm.tsx';
import {useSetPageLoading} from '~/context/PageLoadingContext.tsx';
import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import styles from './Checkout.module.scss';

const CARD_PAYMENT_METHOD = 'card';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  paymentMethod: string;
  createAccount: boolean;
  username: string;
  password: string;
  customerNote: string;
}

export default function Checkout() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {cart, isLoading: isCartLoading} = useCart();
  const {profile} = useProfile();
  const {paymentGateways, isLoading: isLoadingGateways} = usePaymentGateways();
  const {checkout, isLoading: isSubmitting, error} = useCheckout();

  useSetPageLoading(isCartLoading);

  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const cardFieldsRef = useRef<CardFieldsFormHandle>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {errors},
  } = useForm<CheckoutForm>();

  useEffect(() => {
    reset({
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      email: profile?.email ?? '',
    });
  }, [profile, reset]);

  useEffect(() => {
    if (!isLoadingGateways && paymentGateways.length > 0) {
      reset((current) => ({...current, paymentMethod: current.paymentMethod || paymentGateways[0].id}));
    }
  }, [isLoadingGateways, paymentGateways, reset]);

  const items = cart?.contents.nodes ?? [];
  const isEmpty = !isCartLoading && items.length === 0;
  const selectedPaymentMethod = watch('paymentMethod');

  const onSubmit = async (formData: CheckoutForm) => {
    setCardError(null);

    try {
      let transactionId: string | undefined;

      if (formData.paymentMethod === CARD_PAYMENT_METHOD) {
        try {
          transactionId = await cardFieldsRef.current?.submit();
        } catch (cardSubmitError) {
          setCardError(
            cardSubmitError instanceof Error ? cardSubmitError.message : t('checkout.cardPaymentFailed'),
          );
          return;
        }
      }

      const {order, redirect} = await checkout({
        paymentMethod: formData.paymentMethod,
        billing: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        account:
          showCreateAccount && formData.username && formData.password
            ? {username: formData.username, password: formData.password}
            : undefined,
        customerNote: formData.customerNote,
        isPaid: transactionId ? true : undefined,
        transactionId,
      });

      // For gateways that need an external confirmation step (PayPal, hosted
      // checkouts, ...) `redirect` points off-site — leave the SPA and send
      // the shopper there. Otherwise (COD, etc.) it's WooCommerce's own
      // thank-you page on our backend domain, which isn't the SPA route —
      // go to our own order-received page instead.
      const isExternalRedirect =
        redirect && new URL(redirect).origin !== new URL(import.meta.env.VITE_SITE_URI).origin;

      if (isExternalRedirect) {
        window.location.href = redirect;
        return;
      }

      navigate(`/checkout/order-received/${order.databaseId}`, {state: {order}});
    } catch (submitError) {
      console.error('Checkout failed:', submitError);
    }
  };

  return (
    <SiteLayout>
      <PageTitle>{t('checkout.checkout')}</PageTitle>

      {isEmpty ? (
        <p>{t('checkout.cartEmpty')}</p>
      ) : (
        <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
          <div className='form'>
            <div className='form__fieldsgroup'>
              <p className={styles.sectionTitle}>{t('checkout.billingDetails')}</p>

              <div className='form__fieldset'>
                <label>{t('auth.firstName')}</label>
                <input type='text' {...register('firstName', {required: t('errors.inputRequired')})} />
                {errors.firstName && <p className='error'>{errors.firstName.message}</p>}
              </div>

              <div className='form__fieldset'>
                <label>{t('auth.lastName')}</label>
                <input type='text' {...register('lastName', {required: t('errors.inputRequired')})} />
                {errors.lastName && <p className='error'>{errors.lastName.message}</p>}
              </div>

              <div className='form__fieldset'>
                <label>{t('auth.email')}</label>
                <input type='email' {...register('email', {required: t('errors.emailRequired')})} />
                {errors.email && <p className='error'>{errors.email.message}</p>}
              </div>

              <div className='form__fieldset'>
                <label>{t('checkout.phone')}</label>
                <input type='tel' {...register('phone')} />
              </div>
            </div>

            {!isLoadingGateways && paymentGateways.length > 0 && (
              <div className={styles.section}>
                <p className={styles.sectionTitle}>{t('checkout.paymentMethod')}</p>
                <div className={styles.paymentOptions}>
                  {paymentGateways.map((gateway) => (
                    <label
                      key={gateway.id}
                      className={
                        selectedPaymentMethod === gateway.id
                          ? styles.paymentOptionActive
                          : styles.paymentOption
                      }>
                      <input
                        type='radio'
                        value={gateway.id}
                        {...register('paymentMethod', {required: true})}
                      />
                      <span className={styles.radioDot} />
                      <span>
                        <span className={styles.paymentTitle}>{gateway.title || gateway.id}</span>
                        {gateway.description && (
                          <span className={styles.paymentDescription}>{gateway.description}</span>
                        )}
                      </span>
                    </label>
                  ))}

                  <label
                    className={
                      selectedPaymentMethod === CARD_PAYMENT_METHOD
                        ? styles.paymentOptionActive
                        : styles.paymentOption
                    }>
                    <input
                      type='radio'
                      value={CARD_PAYMENT_METHOD}
                      {...register('paymentMethod', {required: true})}
                    />
                    <span className={styles.radioDot} />
                    <span className={styles.paymentTitle}>{t('checkout.card')}</span>
                  </label>
                </div>

                {selectedPaymentMethod === CARD_PAYMENT_METHOD && (
                  <>
                    <CardFieldsForm ref={cardFieldsRef} onError={setCardError} />
                    {cardError && <p className='error'>{cardError}</p>}
                  </>
                )}
              </div>
            )}

            {!profile && (
              <div className={styles.section}>
                <label className='checkbox'>
                  <input
                    type='checkbox'
                    checked={showCreateAccount}
                    onChange={(e) => setShowCreateAccount(e.target.checked)}
                  />
                  <span>{t('checkout.createAccount')}</span>
                </label>

                {showCreateAccount && (
                  <div className={styles.accountFields}>
                    <div className='form__fieldset'>
                      <label>{t('checkout.username')}</label>
                      <input
                        type='text'
                        {...register('username', {required: showCreateAccount && t('errors.inputRequired')})}
                      />
                      {errors.username && <p className='error'>{errors.username.message}</p>}
                    </div>
                    <div className='form__fieldset'>
                      <label>{t('checkout.password')}</label>
                      <input
                        type='password'
                        {...register('password', {required: showCreateAccount && t('errors.inputRequired')})}
                      />
                      {errors.password && <p className='error'>{errors.password.message}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className={styles.section}>
              <div className='form__fieldset'>
                <label>{t('checkout.orderNote')}</label>
                <textarea {...register('customerNote')} />
              </div>
            </div>

            {error && <p className='error'>{t('common.somethingWentWrong')}</p>}
          </div>

          <div className={styles.summary}>
            <p className={styles.sectionTitle}>{t('cart.cart')}</p>

            <ul className={styles.summaryList}>
              {items.map((item) => (
                <li key={item.key} className={styles.summaryItem}>
                  <span>{item.product?.node?.name ?? t('cart.productUnavailable')}</span>
                  <span>{item.total}</span>
                </li>
              ))}
            </ul>

            <div className={styles.summaryRow}>
              <span>{t('cart.subtotal')}</span>
              <span>{cart?.subtotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>{t('cart.total')}</span>
              <strong>{cart?.total}</strong>
            </div>

            <Button
              isSubmit
              disabled={isSubmitting || !selectedPaymentMethod}
              className={styles.submitButton}>
              {isSubmitting ? t('common.loading') : t('checkout.placeOrder')}
            </Button>
          </div>
        </form>
      )}
    </SiteLayout>
  );
}

import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import SiteLayout from '../../layouts/SiteSimpleLayout/SiteLayout.tsx';
import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import Button from '~/components/Button/Button.tsx';
import {useCart, useCheckout, usePaymentGateways, useProfile} from '@brutmaps/api';
import {useTranslation} from 'react-i18next';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
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

  const [showCreateAccount, setShowCreateAccount] = useState(false);

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
      country: profile?.country ?? '',
    });
  }, [profile, reset]);

  useEffect(() => {
    if (!isLoadingGateways && paymentGateways.length > 0) {
      reset((current) => ({...current, paymentMethod: current.paymentMethod || paymentGateways[0].id}));
    }
  }, [isLoadingGateways, paymentGateways, reset]);

  const isEmpty = !isCartLoading && (cart?.contents.nodes.length ?? 0) === 0;

  const onSubmit = async (formData: CheckoutForm) => {
    try {
      const {order, redirect} = await checkout({
        paymentMethod: formData.paymentMethod,
        billing: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address1: formData.address1,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          country: formData.country,
        },
        account:
          showCreateAccount && formData.username && formData.password
            ? {username: formData.username, password: formData.password}
            : undefined,
        customerNote: formData.customerNote,
      });

      // For gateways that need an external confirmation step (PayPal, hosted
      // checkouts, ...) `redirect` points off-site — leave the SPA and send
      // the shopper there. Otherwise (COD, etc.) it's WooCommerce's own
      // thank-you page on our backend domain, which isn't the SPA route —
      // go to our own order-received page instead.
      const isExternalRedirect = redirect && new URL(redirect).origin !== new URL(import.meta.env.VITE_SITE_URI).origin;

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
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <div className='form__fieldsgroup'>
            <p>{t('checkout.billingDetails')}</p>

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
              <label>{t('checkout.address1')}</label>
              <input type='text' {...register('address1', {required: t('errors.inputRequired')})} />
              {errors.address1 && <p className='error'>{errors.address1.message}</p>}
            </div>

            <div className='form__fieldset'>
              <label>{t('checkout.city')}</label>
              <input type='text' {...register('city', {required: t('errors.inputRequired')})} />
              {errors.city && <p className='error'>{errors.city.message}</p>}
            </div>

            <div className='form__fieldset'>
              <label>{t('checkout.state')}</label>
              <input type='text' {...register('state')} />
            </div>

            <div className='form__fieldset'>
              <label>{t('checkout.postcode')}</label>
              <input type='text' {...register('postcode', {required: t('errors.inputRequired')})} />
              {errors.postcode && <p className='error'>{errors.postcode.message}</p>}
            </div>

            <div className='form__fieldset'>
              <label>{t('auth.country')}</label>
              <input type='text' {...register('country', {required: t('errors.inputRequired')})} />
              {errors.country && <p className='error'>{errors.country.message}</p>}
            </div>

            {!isLoadingGateways && paymentGateways.length > 0 && (
              <div className='form__fieldset'>
                <label>{t('checkout.paymentMethod')}</label>
                {paymentGateways.map((gateway) => (
                  <label key={gateway.id} className='checkbox'>
                    <input type='radio' value={gateway.id} {...register('paymentMethod', {required: true})} />
                    <span>{gateway.title}</span>
                  </label>
                ))}
              </div>
            )}

            {!profile && (
              <>
                <label className='checkbox'>
                  <input
                    type='checkbox'
                    checked={showCreateAccount}
                    onChange={(e) => setShowCreateAccount(e.target.checked)}
                  />
                  <span>{t('checkout.createAccount')}</span>
                </label>

                {showCreateAccount && (
                  <>
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
                  </>
                )}
              </>
            )}

            <div className='form__fieldset'>
              <label>{t('checkout.orderNote')}</label>
              <textarea {...register('customerNote')} />
            </div>

            {error && <p className='error'>{t('common.somethingWentWrong')}</p>}

            <Button isSubmit disabled={isSubmitting || !watch('paymentMethod')}>
              {isSubmitting ? t('common.loading') : t('checkout.placeOrder')}
            </Button>
          </div>
        </form>
      )}
    </SiteLayout>
  );
}

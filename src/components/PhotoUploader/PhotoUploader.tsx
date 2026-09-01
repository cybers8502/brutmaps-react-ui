import classNames from 'classnames';
import type React from 'react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {CancelBolderIcon, PenIcon} from '~/components/Icons/Icons.tsx';
import styles from './PhotoUploader.module.scss';

interface PhotoUploaderProps {
  onPhotoChange: (file: File | null) => void;
  photoPreview: string | null;
}

export default function PhotoUploader({onPhotoChange, photoPreview}: PhotoUploaderProps) {
  const {t} = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setErrorMessage(t('errors.allowedImageFormat'));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage(t('errors.allowedImageSize'));
      return;
    }
    setErrorMessage('');
    onPhotoChange(file);
  };

  return (
    <div
      className={styles.container}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
      <div className={classNames(styles.photoEl, {[styles['drag-active']]: dragActive})}>
        <label className={styles.photoPreview}>
          <input type='file' accept='image/*' onChange={(e) => handleFileChange(e.target.files![0])} />
          {photoPreview ? (
            <img src={photoPreview} alt={t('photoUploader.loadedPhotoAlt')} width='100' />
          ) : (
            <span className={classNames(styles.thing)}>
              <PenIcon />
            </span>
          )}
        </label>
        {photoPreview ? (
          <button className={classNames(styles.thing)} type='button' onClick={() => onPhotoChange(null)}>
            <CancelBolderIcon />
          </button>
        ) : (
          <></>
        )}
      </div>
      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : <p>{t('photoUploader.yourPhoto')}</p>}
    </div>
  );
}

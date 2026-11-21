import Image from 'next/image';
import { DownloadLink } from '../DownloadLink/DownloadLink';
import { APP_CONFIG } from '../../config/appConfig';
import styles from './StoreBadges.module.css';

export default function StoreBadges({ appStoreUrl, showAndroidBadge = false }) {
  return (
    <div className={styles.group}>
      {showAndroidBadge && <span className={styles.platform}>Available on Android™</span>}
      <div className={styles.links}>
        <DownloadLink href={appStoreUrl} target="_blank" rel="noopener noreferrer">
          <Image className={styles.apple} src="/app-store-badge.svg" alt="Download on the App Store" width={120} height={40} />
        </DownloadLink>
        <a href={APP_CONFIG.GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer">
          <Image className={styles.play} src="/google-play-badge.png" alt="Get it on Google Play" width={646} height={250} unoptimized />
        </a>
      </div>
    </div>
  );
}

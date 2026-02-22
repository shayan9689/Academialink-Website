import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import HeroCta from './components/HeroCta';
import LandingHeader from './components/LandingHeader';
import { LandingAuthProvider } from './components/LandingAuthContext';
import LandingCtaButtons from './components/LandingCtaButtons';
import AnimateInView from './components/AnimateInView';
import HeroAnimated, { HeroAnimatedItem } from './components/HeroAnimated';
import {
  GraduationCapIcon,
  DocumentIcon,
  UsersIcon,
  ShieldCheckIcon,
  QuoteIcon,
  FeatureBadgeIcon,
} from './components/Icons';

export default function HomePage() {
  return (
    <LandingAuthProvider>
      <div className={styles.page}>
        <LandingHeader styles={styles as Record<string, string>} />

        <HeroAnimated className={styles.hero}>
          <HeroAnimatedItem>
            <span className={styles.heroBanner}>
              YOU ARE NOW REWARDED FOR RESEARCH.
            </span>
          </HeroAnimatedItem>
          <HeroAnimatedItem>
            <h1 className={styles.heroTitle}>
              Unlock the Future of
              <span className={styles.heroTitleAccent}>Academic Research</span>
            </h1>
          </HeroAnimatedItem>
          <HeroAnimatedItem>
            <p className={styles.heroSubtitle}>
              The global repository for verified research, transparent peer reviews,
              and academic collaborations. Share your work with the world.
            </p>
          </HeroAnimatedItem>
          <HeroAnimatedItem>
            <HeroCta styles={styles as Record<string, string>} />
          </HeroAnimatedItem>
        </HeroAnimated>

        <AnimateInView as="section" className={styles.trustStatsSection} aria-label="Trusted institutions and statistics">
          <p className={styles.trustHeading}>
            Trusted by leading institutions worldwide.
          </p>
          <div className={styles.trustRow}>
            {['Oxford', 'Stanford', 'MIT', 'Harvard', 'Cambridge'].map((name) => (
              <div key={name} className={styles.trustCell}>
                <GraduationCapIcon className={styles.trustIcon} />
                <span>{name}</span>
              </div>
            ))}
          </div>
          <div className={styles.statsRow}>
            <StatCard value="124K+" label="Verified Papers" icon={<DocumentIcon className={styles.statIconSvg} />} />
            <StatCard value="18K+" label="Active Reviewers" icon={<ShieldCheckIcon className={styles.statIconSvg} />} />
            <StatCard value="2.1M" label="Global Citations" icon={<QuoteIcon className={styles.statIconSvg} />} />
            <StatCard value="45K" label="Collaborations" icon={<UsersIcon className={styles.statIconSvg} />} />
          </div>
        </AnimateInView>

        <AnimateInView as="section" className={styles.feature} aria-labelledby="feature-peer-review">
          <div className={styles.featureContent}>
            <FeatureBadgeIcon className={styles.featureIconSvg} />
            <h2 id="feature-peer-review" className={styles.featureTitle}>
              Seamless Peer Review.
            </h2>
            <p className={styles.featureDesc}>
              Experience a streamlined review workflow where quality meets speed.
              Our double-blind peer review system ensures that only the most
              rigorous research gets the spotlight it deserves.
            </p>
            <ul className={styles.featureList}>
              <li>Register as a peer reviewer now</li>
              <li>Submit your reviews on Academialink</li>
            </ul>
          </div>
          <div className={styles.featureImageWrap}>
            <Image
              src="/images/peer-review.png"
              alt="Professionals reviewing documents together"
              width={600}
              height={450}
              className={styles.featureImage}
            />
          </div>
        </AnimateInView>

        <AnimateInView as="section" className={`${styles.feature} ${styles.featureReverse}`} aria-labelledby="feature-distribution">
          <div className={styles.featureContent}>
            <FeatureBadgeIcon className={styles.featureIconSvg} />
            <h2 id="feature-distribution" className={styles.featureTitle}>
              Global Distribution.
            </h2>
            <p className={styles.featureDesc}>
              Reach a worldwide academic community. Academialink distributes your
              findings to thousands of institutions and researchers worldwide
              through our decentralized sharing system.
            </p>
            <ul className={styles.featureList}>
              <li>Distribute your work with Academialink</li>
              <li>Earn rewards from our research contributions</li>
            </ul>
          </div>
          <div className={styles.featureImageWrap}>
            <Image
              src="/images/global-distribution.png"
              alt="Global network and worldwide reach"
              width={600}
              height={450}
              className={styles.featureImage}
            />
          </div>
        </AnimateInView>

        <AnimateInView as="section" className={styles.feature} aria-labelledby="feature-version-control">
          <div className={styles.featureContent}>
            <FeatureBadgeIcon className={styles.featureIconSvg} />
            <h2 id="feature-version-control" className={styles.featureTitle}>
              Advanced Version Control.
            </h2>
            <p className={styles.featureDesc}>
              Never lose track of your progress. Our integrated versioning system
              allows you to track multiple unique iterations of your work, make
              changes, and revert to previous versions with ease.
            </p>
            <ul className={styles.featureList}>
              <li>Keep track of all your versions</li>
              <li>Collaborate efficiently with your team</li>
            </ul>
          </div>
          <div className={styles.featureImageWrap}>
            <Image
              src="/images/version-control.png"
              alt="Technical design and version control"
              width={600}
              height={450}
              className={styles.featureImage}
            />
          </div>
        </AnimateInView>

        <AnimateInView as="section" className={styles.ctaBlock} aria-labelledby="cta-heading">
          <h2 id="cta-heading" className={styles.ctaTitle}>
            Ready to advance human knowledge?
          </h2>
          <p className={styles.ctaText}>
            Join the most trusted academic community on the web. Start publishing,
            reviewing, or exploring groundbreaking research today.
          </p>
          <LandingCtaButtons styles={styles as Record<string, string>} />
        </AnimateInView>

        <AnimateInView as="section" id="mission" className={styles.missionSection} aria-labelledby="mission-heading">
          <h2 id="mission-heading" className={styles.missionTitle}>
            Our Mission
          </h2>
          <p className={styles.missionLead}>
            Academialink exists to make verified research accessible, transparent, and rewarding for researchers and institutions worldwide.
          </p>
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <h3 className={styles.missionCardTitle}>Open access</h3>
              <p className={styles.missionCardText}>
                We believe findings that advance human knowledge should be findable and reusable by everyone. Our repository supports open access while respecting author rights and institutional partnerships.
              </p>
            </div>
            <div className={styles.missionCard}>
              <h3 className={styles.missionCardTitle}>Trust through verification</h3>
              <p className={styles.missionCardText}>
                Every paper on Academialink goes through our peer review process. We surface review status and citations so you can trust the work you read and cite.
              </p>
            </div>
            <div className={styles.missionCard}>
              <h3 className={styles.missionCardTitle}>Reward contribution</h3>
              <p className={styles.missionCardText}>
                Researchers who publish, review, and collaborate earn recognition and rewards. We align incentives so that quality and integrity are valued across the platform.
              </p>
            </div>
          </div>
          <p className={styles.missionFooter}>
            Join us in building a more open and trustworthy research ecosystem.
          </p>
        </AnimateInView>
      </div>
    </LandingAuthProvider>
  );
}

function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <article className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </article>
  );
}

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SearchForm } from '@/components/features/SearchForm';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      <Header logo={<h1>OutletRentalCars</h1>} />
      <main id="main-content" className={styles.main}>
        <Container size="xl">
          <div className={styles.hero}>
            <h2 className={styles.heroTitle}>
              Encuentra el vehículo perfecto para tu viaje
            </h2>
            <p className={styles.heroDescription}>
              Busca entre nuestra amplia selección de vehículos disponibles
            </p>
          </div>
          <SearchForm />
        </Container>
      </main>
      <Footer />
    </>
  );
}


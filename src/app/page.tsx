'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from './useUserContext';
import styles from './page.module.css';

const HomePage: React.FC = () => {
  const { users} = useUserContext();
  const router = useRouter();

  const handleUserClick = (id: number) => {
    router.push(`/stories/${id}`);
  };

  return (
    <div className={styles.container}>
      {users.map((user: any) => (
        <div key={user.id} className={styles.userCard} onClick={() => handleUserClick(user.id)}>
          <div className={styles.storyCircle}>
            <img src={user.image} alt={user.name} />
          </div>
          <div className={styles.userDescription}>
            {user.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;

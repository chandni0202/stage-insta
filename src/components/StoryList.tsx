'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './StoryList.module.css';

interface Story {
  id: number;
  title: string;
  image: string;
  description: string
}

interface StoryListProps {
  stories: Story[];
}

const StoryList: React.FC<StoryListProps> = ({ stories }) => {
  const router = useRouter();

  const handleStoryClick = (id: number) => {
    router.push(`/stories/${id}`);
  };

  return (
    <div className={styles.container}>
      {stories.map((story) => (
        <div
          key={story.id}
          className={styles.storyItem}
          onClick={() => handleStoryClick(story.id)}
        >
          <Image src={story.image} alt={story.title} className={styles.storyImage} />
        </div>
      ))}
    </div>
  );
};

export default StoryList;

'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useParams, useRouter } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './StoryViewer.module.css';
import ProgressBar from '../../../components/progressBar';
import { useUserContext } from '../../useUserContext';

interface Story {
  id: number;
  title: string;
  image: string;
  description: string;
}

const StoriesPage: React.FC = () => {
  const params = useParams<{ storyId?: string }>();
  const storyId = params?.storyId;
  const { users } = useUserContext();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const currentDuration: number = 5000;
  const router = useRouter();
  const swiperRef = useRef<any>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [completedIndices, setCompletedIndices] = useState<Set<number>>(new Set());
  const [isClosed, setIsClosed] = useState<boolean>(false);

  const fetchStories = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${storyId}/stories`);
      const data = await response.json();
      setStories(data);

      const lastIndex = localStorage.getItem(`lastIndex_${storyId}`);
      if (lastIndex) {
        setActiveIndex(parseInt(lastIndex, 10));
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  }, [storyId]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    if (stories.length > 0 && activeIndex === stories.length - 1 && !isTransitioning && !isClosed) {
      setIsTransitioning(true);  
      setTimeout(() => {
        const currentIndex = users.findIndex((user: any) => user.id === parseInt(storyId || ''));
        let nextUser = users[currentIndex + 1];
        if(window.location.pathname == "/"){
          nextUser = null;
        }
        if (nextUser) {
          router.push(`/stories/${nextUser.id}`);
        } else {
          router.push('/');
          setIsClosed(true);
        }
        setIsTransitioning(false);
      }, 5000);
    }
  
  }, [activeIndex, stories.length, router, storyId, users, isTransitioning, isClosed]);

  const handleClick = (event: React.MouseEvent) => {
    const containerWidth = (event.currentTarget as HTMLElement).offsetWidth;
    const clickPosition = event.clientX - (event.currentTarget as HTMLElement).getBoundingClientRect().left;

    if (clickPosition < containerWidth / 2) {
      if (swiperRef.current?.swiper?.activeIndex === 0) {
        const currentUserIndex = users.findIndex((user: any) => user.id === parseInt(storyId || ''));
        if (currentUserIndex > 0) {
          const prevUser = users[currentUserIndex - 1];
          localStorage.setItem(`lastIndex_${storyId}`, activeIndex.toString());
          router.push(`/stories/${prevUser.id}`);
        } else {
          router.push('/');
        }
      } else {
        swiperRef.current?.swiper?.slidePrev();
      }
    } else {
      if (swiperRef.current?.swiper?.activeIndex === stories.length - 1) {
        // Immediate navigation if on the last story
        const currentIndex = users.findIndex((user: any) => user.id === parseInt(storyId || ''));
        const nextUser = users[currentIndex + 1];
        if (nextUser) {
          router.push(`/stories/${nextUser.id}`);
        } else {
          router.push('/');
        }
        // Stop autoplay to prevent it from running after manual navigation
        swiperRef.current?.swiper?.autoplay.stop();
      } else {
        swiperRef.current?.swiper?.slideNext();
      }
    }
  };

  const handleClose = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.stop();
    }
    setIsClosed(true);
    localStorage.setItem('isClosed', 'true');
    router.push('/');
  };

  useEffect(() => {
    if (isClosed) {
      setIsTransitioning(false);
      setCompletedIndices(new Set());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(`lastIndex_${storyId}`, activeIndex.toString());
    setCompletedIndices((prev) => new Set(prev).add(activeIndex));
  }, [activeIndex, storyId]);

  const currentUser = users?.find((user: any) => user.id === parseInt(storyId || ''));
  const profileImageUrl = currentUser?.image;
  const description = currentUser?.description;

  return (
    <div className={styles.container}>
      <div className={styles.progressContainer}>
        {stories.map((_, index) => (
          <ProgressBar
            key={index}
            isActive={activeIndex === index}
            isCompleted={completedIndices.has(index)}
            duration={currentDuration}
            reset={isClosed}
          />
        ))}
      </div>

      <div className={styles.mainStory} onClick={handleClick}>
        {stories.length > 0 && (
          <Swiper
            ref={swiperRef}
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            autoplay={{
              delay: currentDuration,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination]}
            className={styles.mainSwiper}
          >
            {stories.map((story) => (
              <SwiperSlide key={story.id}>
                <div className={styles.storyContent}>
                  <div>
                  <img src={profileImageUrl} className={styles.profileImg} width="50px" height="50px" alt="Profile" />
                  <span className={styles.profileDes}>{description}</span>
                  </div>
                  <button className={styles.closeButton} onClick={handleClose}>×</button>
                  <img src={story.image} alt={story.title} className={styles.storyImage} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;

type SoundType = 'click' | 'correct' | 'incorrect' | 'levelComplete' | 'gameComplete' | 'rotate';

class SoundManager {
  private sounds: Record<SoundType, HTMLAudioElement> = {} as Record<SoundType, HTMLAudioElement>;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private userInteracted: boolean = false;

  constructor() {
    // 在组件挂载后初始化声音
    setTimeout(() => this.init(), 100);
    this.setupUserInteractionListeners();
  }

  private init() {
    try {
      console.log('初始化音效系统...');
      // 初始化所有声音
      this.sounds = {
        click: new Audio('./sounds/click.mp3'),
        correct: new Audio('./sounds/correct.mp3'),
        incorrect: new Audio('./sounds/incorrect.mp3'),
        levelComplete: new Audio('./sounds/level-complete.mp3'),
        gameComplete: new Audio('./sounds/game-complete.mp3'),
        rotate: new Audio('./sounds/rotate.mp3')
      };

      // 预加载所有声音
      Object.entries(this.sounds).forEach(([key, audio]) => {
        audio.preload = 'auto'; // 设置预加载
        audio.load();
        console.log(`预加载音效: ${key}, 路径: ${audio.src}`);
        
        // 监听加载完成事件
        audio.addEventListener('canplaythrough', () => {
          console.log(`音效 ${key} 已加载完成并可以播放`);
        });
        
        // 监听加载错误
        audio.addEventListener('error', (e) => {
          console.error(`音效 ${key} 加载失败:`, e);
          console.error(`尝试加载的URL: ${audio.src}`);
        });
      });

      this.isInitialized = true;
      console.log('音效系统初始化完成');
    } catch (error) {
      console.error('初始化音效系统时出错:', error);
    }
  }

  private setupUserInteractionListeners() {
    // 用户交互后标记为可以播放声音
    const markUserInteracted = () => {
      this.userInteracted = true;
      console.log('用户已交互，音频可以播放');
      
      // 尝试播放一个静音的音频，以解除浏览器的自动播放限制
      try {
        const audio = new Audio();
        audio.volume = 0;
        audio.play().then(() => {
          console.log('已解除浏览器自动播放限制');
        }).catch(e => {
          console.warn('无法解除浏览器自动播放限制:', e);
        });
      } catch (e) {
        console.warn('尝试解除自动播放限制时出错:', e);
      }
      
      // 移除事件监听器，因为我们只需要知道用户曾经交互过
      document.removeEventListener('click', markUserInteracted);
      document.removeEventListener('touchstart', markUserInteracted);
      document.removeEventListener('keydown', markUserInteracted);
    };

    document.addEventListener('click', markUserInteracted);
    document.addEventListener('touchstart', markUserInteracted);
    document.addEventListener('keydown', markUserInteracted);
  }

  public play(type: SoundType) {
    if (this.isMuted) {
      console.log(`音效静音中，不播放: ${type}`);
      return;
    }
    
    if (!this.isInitialized) {
      console.warn('音效系统未初始化，尝试初始化...');
      this.init();
      setTimeout(() => this.play(type), 500); // 延迟重试播放
      return;
    }

    try {
      // 检查声音是否存在
      const sound = this.sounds[type];
      if (!sound) {
        console.error(`找不到指定的音效: ${type}`);
        // 如果找不到指定的音效，尝试重新创建
        this.sounds[type] = new Audio(`./sounds/${type}.mp3`);
        this.sounds[type].load();
        return;
      }

      // 检查音频文件是否已加载
      if (sound.readyState === 0) {
        console.warn(`音效 ${type} 尚未加载完成，尝试加载...`);
        sound.src = `./sounds/${type}.mp3`;
        sound.load();
        setTimeout(() => this.play(type), 500); // 延迟重试播放
        return;
      }
      
      // 重置音频
      sound.pause();
      sound.currentTime = 0;
      
      // 显示音频信息
      console.log(`尝试播放音效 ${type}, 路径: ${sound.src}, 状态: ${sound.readyState}`);
      
      // 播放声音
      const playPromise = sound.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log(`成功播放音效: ${type}`);
        }).catch(error => {
          console.warn(`无法播放声音 ${type}:`, error);
          
          // 如果是因为用户尚未交互导致无法播放
          if (!this.userInteracted) {
            console.warn('用户尚未与页面交互，浏览器阻止了音频播放');
            // 为了解决这个问题，我们可以在下一次用户交互时尝试播放
            const playOnUserInteraction = () => {
              this.play(type);
              document.removeEventListener('click', playOnUserInteraction);
            };
            document.addEventListener('click', playOnUserInteraction, { once: true });
          }
        });
      }
    } catch (error) {
      console.error(`播放音效 ${type} 时出错:`, error);
    }
  }

  public mute() {
    this.isMuted = true;
    console.log('音效已静音');
  }

  public unmute() {
    this.isMuted = false;
    console.log('音效已取消静音');
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    console.log(this.isMuted ? '音效已静音' : '音效已取消静音');
    return this.isMuted;
  }

  public isMutedStatus() {
    return this.isMuted;
  }
}

// 创建单例实例
const soundManager = new SoundManager();
export default soundManager;

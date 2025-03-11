type SoundType = 'click' | 'correct' | 'incorrect' | 'levelComplete' | 'gameComplete' | 'rotate';

class SoundManager {
  private correctSound: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private userInteracted: boolean = false;

  constructor() {
    this.init();
    this.setupUserInteractionListeners();
  }

  private init() {
    try {
      console.log('初始化音效系统...');
      // 使用绝对路径初始化正确音效
      this.correctSound = new Audio('/sounds/correct.mp3');
      this.correctSound.preload = 'auto';
      this.correctSound.load();
      console.log('预加载音效: correct, 路径:', this.correctSound.src);
      
      // 监听加载完成事件
      this.correctSound.addEventListener('canplaythrough', () => {
        console.log('音效 correct 已加载完成并可以播放');
      });
      
      // 监听加载错误
      this.correctSound.addEventListener('error', (e) => {
        console.error('音效 correct 加载失败:', e);
        console.error('尝试加载的URL:', this.correctSound?.src);
        // 尝试备用路径
        if (this.correctSound) {
          this.correctSound.src = './sounds/correct.mp3';
          this.correctSound.load();
          console.log('尝试备用路径:', this.correctSound.src);
        }
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
      
      // 确保音效系统已初始化
      if (!this.isInitialized) {
        this.init();
      }
      
      // 尝试播放一个静音的音频，以解除浏览器的自动播放限制
      try {
        if (this.correctSound) {
          // 直接使用correctSound进行预热
          const volume = this.correctSound.volume;
          this.correctSound.volume = 0;
          this.correctSound.play().then(() => {
            console.log('已解除浏览器自动播放限制');
            this.correctSound!.pause();
            this.correctSound!.currentTime = 0;
            this.correctSound!.volume = volume; // 恢复原音量
          }).catch(e => {
            console.warn('无法解除浏览器自动播放限制:', e);
            // 使用备用方法
            const silentAudio = new Audio();
            silentAudio.volume = 0;
            silentAudio.src = '/sounds/correct.mp3';
            silentAudio.play().catch(() => {});
          });
        }
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
    // 如果不是正确音效，直接返回
    if (type !== 'correct') {
      return;
    }
    
    if (this.isMuted) {
      console.log('音效静音中，不播放: correct');
      return;
    }
    
    if (!this.isInitialized || !this.correctSound) {
      console.warn('音效系统未初始化，尝试初始化...');
      this.init();
      setTimeout(() => this.play(type), 100); // 减少延迟
      return;
    }

    try {
      // 确保已经与用户交互
      if (!this.userInteracted) {
        console.warn('用户尚未与页面交互，尝试标记用户交互');
        // 模拟用户交互
        this.userInteracted = true;
      }
      
      // 检查音频文件是否已加载
      if (this.correctSound.readyState < 2) { // HAVE_CURRENT_DATA = 2
        console.warn('音效 correct 尚未加载完成，尝试加载...');
        // 尝试不同的路径加载
        if (this.correctSound.src.includes('./sounds/')) {
          this.correctSound.src = '/sounds/correct.mp3';
        } else {
          this.correctSound.src = './sounds/correct.mp3';
        }
        this.correctSound.load();
        setTimeout(() => this.play(type), 100);
        return;
      }
      
      // 重置音频
      this.correctSound.pause();
      this.correctSound.currentTime = 0;
      
      // 确保音量是正常的
      this.correctSound.volume = 1;
      
      // 显示音频信息
      console.log('尝试播放音效 correct, 路径:', this.correctSound.src, '状态:', this.correctSound.readyState);
      
      // 播放声音
      const playPromise = this.correctSound.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('成功播放音效: correct');
        }).catch(error => {
          console.warn('无法播放声音 correct:', error);
          
          // 再次尝试播放，可能是浏览器暂时还没准备好
          setTimeout(() => {
            if (this.correctSound) {
              this.correctSound.play().catch(e => {
                console.error('二次尝试播放失败:', e);
              });
            }
          }, 100);
        });
      }
    } catch (error) {
      console.error('播放音效 correct 时出错:', error);
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

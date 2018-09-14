import wepy from 'wepy';

export default class extends wepy.mixin {
  data = {
    // tab 所有配置
    // {
    //   text: "我能兑",
    //   title: "我能兑",   // 标题
    //   iconPath: "/images/home.png",
    //   selectedIconPath: "/images/home_active.png",
    //   component: "exch", // 组件名
    //   showPage: true, // 是否显示页面（可作为按钮使用）
    //   enablePageScroll: false, // 监听页面滚动 组件中使用onPageScroll
    //   enableReachBottom: false, // 监听滚动到底 组件中使用onReachBottom
    //   enablePullDownRefresh: false, // 监听下拉加载 组件中使用onPullDownRefresh
    // }
    tabs: [],
    offsets: [], // 滚动距离
    activeIndex: 0,
  }

  events = {
    onTabChange(index) {
      const tab = this.tabs[index];
      if (tab.showPage !== false) {
        // 获取当前滚动距离
        wx.createSelectorQuery()
          .selectViewport()
          .scrollOffset(({ scrollTop }) => {
            // 储存当前滚动距离
            this.offsets[this.activeIndex] = scrollTop;
            // 滚动到上次的距离
            if (!!this.offsets[index]) {
              setTimeout(() => {
                wx.pageScrollTo({
                  scrollTop: this.offsets[index],
                  duration: 0
                });
              }, 100);
            }
            this.activeIndex = index;
            this.updateTitle();
            this.invokeTab('onShow');
            this.$apply();
          })
          .exec();
      } else {
        this.$invoke(tab.component, 'onShow');
      }
    }
  }

  onReachBottom() {
    if (this.tabs[this.activeIndex].enableReachBottom) {
      this.invokeTab('onReachBottom');
    }
  }

  onPullDownRefresh() {
    if (this.tabs[this.activeIndex].enablePullDownRefresh) {
      this.invokeTab('onPullDownRefresh');
    }
  }

  onShow() {
    this.invokeTab('onShow');
  }

  invokeTab(method, ...args) {
    this.$invoke(this.tabs[this.activeIndex].component, method, ...args);
  }

  updateTitle() {
    const activeTab = this.tabs[this.activeIndex];
    wx.setNavigationBarTitle({ title: activeTab.title || activeTab.text });
  }
}
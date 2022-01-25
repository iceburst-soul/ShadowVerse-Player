/*
   =================笔记心得=================
   1、length是真实长度,第一个不是0是1
   2、不能在ui线程中的子线程进行更新ui修改操作,会涉及线程安全问题而报错,如有需要,应使用ui,run/ui.post方法进行操作
*/
"ui";
// =================全局变量=================
let AllPath = [];       //保存音乐路径的数组
let PlayPath;           //当前播放路径
let Index = 0;          //当前播放音乐对应的数组下标
let dir = "/storage/emulated/0/脚本/DNA播放器/music";    //音乐存放路径/storage/emulated/0/脚本/DNA播放器/music   ./music
let img;
// =================功能函数=================
// 启动时立刻进行打乱
AllPath = ScanPath();
shuffleSort(AllPath);
// 扫描并获取所有音乐路径
function ScanPath() {
        var mp3Files = files.listDir(dir, function(name){
            return name.endsWith(".mp3") && files.isFile(files.join(dir, name));
            // 扫描，并验证是否为文件，最后返回由mp3文件的名称组成的数组
        });
        return mp3Files;
}
// 洗牌算法：从最后一个数据开始往前，每次从前面随机一个位置，将两者交换，直到数组交换完毕
// 用于打乱AllPath数组
function shuffleSort(arr) {
    var n = arr.length;
    while(n--) {
        // 其中max + 1 = arr.length
        var index = Math.floor(Math.random() * n);
        var temp = arr[index];
        arr[index] = arr[n];
        arr[n] = temp;
        // ES6的解耦交换方式： [arr[index], arr[n]] = [arr[n], arr[index]];
    }
}
// 设定当前播放音乐路径,每次设置下标+1，到尽头后下标清零并打乱AllPath，实现随机不重复
function SetPath() {
    if (Index > AllPath.length -1) {
        Index = 0;
        shuffleSort(AllPath);
        PlayPath = files.join(dir,AllPath[Index]); 
        Index++;
    } else {
        PlayPath = files.join(dir,AllPath[Index]); 
        Index++;
    }
}
function Play() {
    // 设定路径
    SetPath();
    // 播放音乐
    media.playMusic(PlayPath);
    // // 让音乐播放完
    // sleep(media.getMusicDuration());
}
// =================UI布局=================
ui.layout(
    <vertical>
        <appbar>
            <toolbar title = '呼唤内心深处的黑暗'/>
        </appbar>
        <viewpager>
            <vertical padding = "16">
            <img id = "photo" src="file:///storage/emulated/0/脚本/DNA播放器/img/1.png"/>
                <button id = "play" text = "播放按钮"/>
            </vertical>
        </viewpager>
    </vertical> 
)
ui.play.on('click', ()=>{
    threads.start(function () {
            Play();
            ui.run(function () {
                // 通过下标获取播放中bgm的元素
                    img = AllPath[Index - 1];
                // 通过正则提取出bgm名字（纯中文）
                let temp = img.match(/[\u4e00-\u9fa5]/g).join("");
                ui.photo.attr("src","file:///storage/emulated/0/脚本/DNA播放器/img/" + temp + ".png");
                // file://img/" + temp + ".png" 手机上打包时的路径
            })
    })
});

    
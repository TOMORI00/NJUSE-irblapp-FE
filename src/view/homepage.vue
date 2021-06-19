<template>
  <div>
    <div id="title" style="font-size: xxx-large">IRBLAPP</div>
    <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabChange"
    >
      <a-tab-pane key="tab1" tab="目标项目">
        <div
            style="margin-top: 0px"
        >
          <a-input
              v-model="customActiveProject"
              placeholder="输入项目名称"
              style="width: 200px; margin-top: 100px"
              @input="handleInput($event)"
          >
          </a-input>
          <a-upload
              action="http://localhost:8090/data/upload"

              name="files"
          >
            <a-button
                shape="round"
                size="large"
            >Upload Directory
            </a-button>
          </a-upload>
          <a-button
              shape="round"
              size="large"
              style="margin-top: 100px; margin-right: 20px; width: 150px"
              type="primary"
              @click="handleUpload()"
          >确定
          </a-button>
          <a-button
              danger
              shape="round"
              size="large"
              style="margin-top: 100px; margin-left: 20px; width: 150px"
              type="danger"
              @click="handleReset()"
          >重置
          </a-button>
        </div>
      </a-tab-pane>
      <a-tab-pane key="tab2" tab="错误报告">
        <div
            style="margin-top: 100px"
        >
          <a-upload
              action="http://localhost:8090/data/query"
              name="report"
              :multiple=true
          >
            <a-button
                shape="round"
                size="large"
            >Upload Report
            </a-button>
          </a-upload>
          <a-button
              shape="round"
              size="large"
              style="margin-top: 100px; width: 150px; margin-right: 10px"
              type="primary"
              @click="handleQuery()"
          >查询历史
          </a-button>
          <a-button
              shape="round"
              size="large"
              style="margin-top: 100px; width: 150px; margin-left: 10px"
              type="default"
              @click="handleRun()"
          >实时运行
          </a-button>
          <a-spin size="large" style="margin-left: 10px" v-if="running"></a-spin>
        </div>
      </a-tab-pane>
      <a-tab-pane key="tab3" tab="结果展示">
        <a-input
            v-model="searchReport"
            placeholder="输入报告ID"
            style="width: 300px; margin-bottom: 20px"
            @input="handleSearch($event)"
        >
        </a-input>
        <a-table
            :columns="columns"
            :dataSource="data"
            rowKey="report_id"
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
             ">
          <span slot="action" slot-scope="text, record">
            <a-button @click="handleDetail(record)">详情</a-button>
          </span>
        </a-table>
        <a-modal
            v-model="showDetail"
            footer=点击屏幕空白部分以继续
            title="详情"
            width="1000px"
        >
          <a-descriptions bordered v-bind:title="activeReportId">
            <a-descriptions-item label="描述">{{ activeDescription }}</a-descriptions-item>
            <a-descriptions-item label="总结">{{ activeSummary }}</a-descriptions-item>
            <a-descriptions-item label="提交者">{{ activeReporter }}</a-descriptions-item>
            <a-descriptions-item label="已修复文件">{{ activeFixedFiles }}</a-descriptions-item>
            <a-descriptions-item label="疑似文件">{{ activeFiles }}</a-descriptions-item>
          </a-descriptions>
        </a-modal>
        <div>
          <a-row>
            <a-col span=12>
              <a-statistic :value="top1" title="Top 1"></a-statistic>
              <a-statistic :value="top5" title="Top 5"></a-statistic>
              <a-statistic :value="top10" title="Top 10"></a-statistic>
            </a-col>
            <a-col span=12>
              <a-statistic :value="MRR" title="MRR"></a-statistic>
              <a-statistic :value="MAP" title="MAP"></a-statistic>
            </a-col>
          </a-row>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>

const columns = [
  {
    title: '错误报告',
    dataIndex: 'report_id',
    key: 'report_id',
  },
  {
    title: '最可能的文件',
    dataIndex: 'target_file',
    key: 'target_file',
  },
  {
    title: '可能性得分',
    dataIndex: 'target_score',
    key: 'target_score',
  },
  {
    title: '详情',
    key: 'action',
    scopedSlots: {customRender: 'action'},
  },
];

const data = []

export default {
  name: "homepage",
  data() {
    return {
      columns,
      data,
      rawData: [],
      showDetail: false,
      percentage: 0,
      customActiveKey: 'tab1',
      customActiveProject: 'SWT',
      activeReportId: 0,
      activeDescription: '',
      activeReporter: '',
      activeSummary: '',
      activeFixedFiles: '',
      activeFiles: '',
      searchReport: '',
      running: false,
      top1: 0,
      top5: 0,
      top10: 0,
      MRR: 0,
      MAP: 0,
    }
  },
  methods: {
    handleUpload() {
      this.customActiveKey = 'tab2'
    },
    handleQuery() {
      this.$http({
        method: 'post',
        url: 'show',
        params: this.customActiveProject + "_rank"
      }).then(res => {
        console.log(res)
        this.rawData = res.content
        for (let i = 0; i < res.content.length; i++) {
          const temp = {};
          temp["report_id"] = res.content[i]["report_id"]
          temp["target_file"] = res.content[i]["score_list"][0]["code_name"]
          temp["target_score"] = res.content[i]["score_list"][0]["score"]
          this.data.push(temp)
        }
      })

      this.$http({
        method: 'post',
        url: 'metric',
        params: this.customActiveProject
      }).then(res => {
        this.top1 = res.content[0]["top1"]
        this.top5 = res.content[0]["top5"]
        this.top10 = res.content[0]["top10"]
        this.MRR = res.content[0]["mrr"]
        this.MAP = res.content[0]["map"]
      })

      this.customActiveKey = 'tab3'
    },
    handleTabChange(key) {
      this.customActiveKey = key
    },
    handleReset() {
      this.$http({
        method: 'post',
        url: 'reset',
      })
      location.reload(true)
    },
    handleDetail(record) {
      this.activeReportId = record.report_id
      this.$http({
        method: 'post',
        url: 'detail',
        params: {
          "projectName": this.customActiveProject,
          "report_id": record.report_id,
        }
      }).then(res => {
        if (res.success === false) {
          this.$notification.error({
            description: '没有这条报告',
            message: '查找失败',
            duration: 2
          })
        } else {
          this.activeDescription = res.content[this.activeReportId.toString()]["description"]
          this.activeReporter = res.content[this.activeReportId.toString()]["reporter"]
          this.activeSummary = res.content[this.activeReportId.toString()]["summary"]
          let fixFiles = ""
          for (let i = 0; i < res.content[this.activeReportId.toString()]["fixedFiles"].length; i++) {
            fixFiles += res.content[this.activeReportId.toString()]["fixedFiles"][i] + "  "
          }
          this.activeFixedFiles = fixFiles
          let targetFiles = ""
          for (let i = 0;i<this.rawData.length;i++) {
            if (this.rawData[i]["report_id"] === this.activeReportId) {
              for (let i = 0; i < 10 && i < this.rawData[i]["score_list"].length ; i++) {
                targetFiles += "file: " + this.rawData[i]["score_list"][i]["code_name"] + "  "
                targetFiles += "score: " + this.rawData[i]["score_list"][i]["score"] + "  "
              }
            }
          }
          this.activeFiles = targetFiles
          this.showDetail = true
        }
      })
    },
    handleInput(event) {
      this.customActiveProject = event.currentTarget.value
    },
    handleRun() {
      this.running = true;
      this.$http({
        method: 'post',
        url: 'run',
        params: this.customActiveProject
      }).then(res => {
        console.log(res)
        this.top1 = res.content["metric"]["top1"]
        this.top5 = res.content["metric"]["top5"]
        this.top10 = res.content["metric"]["top10"]
        this.MRR = res.content["metric"]["MRR"]
        this.MAP = res.content["metric"]["MAP"]
        this.data = []
        console.log(res.content["score"][0])
        for (let i = 0; i < res.content["score"].length; i++) {
          const temp = {};
          temp["report_id"] = res.content["score"][i]["report_id"]
          temp["target_file"] = res.content["score"][i]["score_list"][0]["code_name"]
          temp["target_score"] = res.content["score"][i]["score_list"][0]["score"]
          this.data.push(temp)
        }
        this.running = false;
        this.customActiveKey = 'tab3'
      })
    },
    handleSearch(event) {
      this.searchReport = event.currentTarget.value
      if (this.searchReport === '') {
        this.handleQuery()
      } else {
        this.$http({
          method: 'post',
          url: 'show',
          params: this.customActiveProject + "_rank"
        }).then(res => {
          for (let i = 0; i < res.content.length; i++) {
            if (res.content[i]["report_id"] === this.searchReport) {
              const one = [];
              const temp = {};
              temp["report_id"] = res.content[i]["report_id"]
              temp["target_file"] = res.content[i]["score_list"][0]["code_name"]
              temp["target_score"] = res.content[i]["score_list"][0]["score"]
              one.push(temp)
              this.data = one
            }
          }
        })

        this.$http({
          method: 'post',
          url: 'metric',
          params: this.customActiveProject
        }).then(res => {
          this.top1 = res.content[0]["top1"]
          this.top5 = res.content[0]["top5"]
          this.top10 = res.content[0]["top10"]
          this.MRR = res.content[0]["mrr"]
          this.MAP = res.content[0]["map"]
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
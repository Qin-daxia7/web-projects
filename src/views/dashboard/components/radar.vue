<template>
  <!-- 雷达图  图表必须给高和宽度-->
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
import { TitleComponent, LegendComponent } from "echarts/components";
import { RadarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer]);
export default {
  mounted() {
    var chartDom = this.$refs.myDiv;
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: "人力资源绩效表",
      },
      //   legend: {
      //     data: ["Allocated Budget", "Actual Spending"],
      //   },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: "工作效率", max: 100 },
          { name: "考勤", max: 100 },
          { name: "积极性", max: 100 },
          { name: "帮助同事", max: 100 },
          { name: "自主学习", max: 100 },
          { name: "正确率", max: 100 },
        ],
      },
      series: [
        {
          name: "Budget vs spending",
          type: "radar",
          data: [
            {
              value: [80, 80, 80, 80, 80, 80],
              name: "平均水平",
            },
            {
              value: [90, 75, 95, 90, 95, 90],
              name: "个人价值",
            },
          ],
        },
      ],
    };

    option && myChart.setOption(option);
  },
};
</script>

<style scoped lang="scss">
.radar-echart {
  width: 500px;
  height: 400px;
}
</style>

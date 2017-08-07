<%--
  Created by IntelliJ IDEA.
  User: jms
  Date: 2017/8/7
  Time: 19:28
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <script src="../Public/publicjs.js"></script>

</head>
<body>
<div id="srconfig">
    <!--搜索框 搜索按钮 所有事件按钮-->
    <el-row type="flex" justify="end" style="padding:5px 0 10px 0">
        <el-col :span="24">
            <el-button type="success" icon="plus" size="small" @click.native="addEvent">新增</el-button>
            <el-button type="info" icon="edit" size="small" @click.native="editEvent">编辑</el-button>
            <el-button type="danger" icon="delete" size="small" @click.native="deleteEvent">删除</el-button>

        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col >
            <div style="border:1px solid #d1ddf9;border-radius: 5px;">
                <el-row>
                    <el-col>
                        <div class="bg-color"><span style="margin-left:20px">序列规则配置维护</span></div>
                    </el-col>
                </el-row>
                <el-row style="padding:15px 10px 10px 10px">
                    <el-col :xs="24" :sm="24" :md="24">
                        <div>
                            <el-input placeholder="请输入内容" v-model="input">
                                <el-button slot="append" icon="search" @click.native="search"></el-button>
                            </el-input>
                        </div>
                    </el-col>
                </el-row>
                <el-row style="padding:0 10px 10px 10px">
                    <el-col :span="24">
                        <template>
                            <el-table :data="seqRuleConfigdata" border highlight-current-row @current-change="handleCurrentChange"
                                      style="width: 100%;border-radius: 5px">
                                <el-table-column prop="seqCode" label="代码" width="">
                                </el-table-column>
                                <el-table-column prop="seqName" label="名称" width="">
                                </el-table-column>
                                <el-table-column prop="seqContent" label="内容" width="">
                                </el-table-column>
                                <el-table-column prop="desp" label="说明" width="">
                                </el-table-column>
                                <el-table-column prop="version" label="版本" width="">
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-col>
                </el-row>
            </div>
        </el-col>
    </el-row>
</div>
</body>
<script src="SequenceRuleConfig.js"></script>
</body>
</html>

/**
 * Created by admin on 2017/10/10.
 */
var basTop;
var left;
var leftBottom;
var right;
//查询接口
var searchMore=serverPath + "/employee/queryPage";

gmp_onload=function(){
    basTop = new Vue({
        el: '#basTop',
        data: {
            addOpe: false,
            addAttr: false,
            takeEffect: false,
            change: false,
        },
        methods: {
            //新增人员信息
            addEvent() {
                operate = 1;
                var htmlUrl = 'personnel_add.html';
                divIndex = ibcpLayer.ShowDiv(htmlUrl, ' 添加人员信息', '600px', '660px',function(){

                });
            },
            //新增业务对象属性
            addProp(){
                operateOPr=1;
                var htmlUrl = 'metadata-prop-add.html';
                divIndex = ibcpLayer.ShowDiv(htmlUrl, '新增对象属性', '800px', '400px', function () {
                    proEm.$refs.proType_1.setValue("base");  //属性类型
                    proEm.proType_1.value='base';//不点击的时候直接把属性传过去
                    proEm.addProForm.proType='base';//只是为了验证的时候判断是否为空

                });
            },
            //生效
            affectProp(){
                var data={
                    "url":affectPropUrl,
                    "jsonData":{rowId:basLeft.currentId},
                    "obj":basTop,
                };
                gmpAjax.showAjax(data,function(res){
                    basLeft.searchLeft();
                })
            },
            //变更
            changeProp(){
                var data={
                    "url":changeUrl,
                    "jsonData":{rowId:basLeft.currentId},
                    "obj":basTop
                };
                gmpAjax.showAjax(data,function(res){
                    basLeft.searchLeft();
                })
            },
            //导出
            exportRow(){
                var htmlUrl = 'personnel_export.html';
                divIndex = ibcpLayer.ShowDiv(htmlUrl, '导出Excel', '800px', '400px', function () {


                });
            }
        }
    });

    left=new Vue({
        el:'#left',
        data:getData.dataObj({
            data: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                        label: '三级 1-1-1'
                    }]
                }]
            }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                        label: '三级 2-1-1'
                    }]
                }, {
                    label: '二级 2-2',
                    children: [{
                        label: '三级 2-2-1'
                    }]
                }]
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1'
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1'
                    }]
                }],
            }],
            defaultProps: {
                children: 'children',
                label: 'label',
            },
            activeName:'first',
        }),
        methods:{
            handleNodeClick(data){
                //console.log(data);
            },
            //tab页点击交换
            handleClick(){

            }

        },
        create(){
            $(document).ready(function () {
                right.leftHeight = $(window).height() - 158;
            });
            $(window).resize(function () {
                right.leftHeight = $(window).height() - 158;
            });
        }
    })

    leftBottom=new Vue({
        el:'#basRightTop',
        template:'#tempBlock',
        data:getData.dataObj({
            data: [{
                label: '一级 11',
                children: [{
                    label: '二级 11-11',
                    children: [{
                        label: '三级 11-11-11'
                    }]
                }]
            }, {
                label: '一级 22',
                children: [{
                    label: '二级 22-11',
                    children: [{
                        label: '三级 22-11-11'
                    }]
                }, {
                    label: '二级 22-22',
                    children: [{
                        label: '三级 22-22-11'
                    }]
                }]
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1'
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1'
                    }]
                }],
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            activeName:'first',
        }),
        methods:{
            handleNodeClick(data){
                //console.log(data);
            },
            handleClick(){

            }

        }
    })

    right=new Vue({
        "el": "#right",
        data: getData.dataObj({
            select: '',
            couldLook:false,
        }),
        methods: {
            headSort(){

            },
            //点击这一行
            currentChange(row, event, column){
                console.log(row)
            },
            //选择复选框
            selectRow(selection, row){
                //最后选择的这一行
                console.log(row)
                //已经选中的
                console.log(selection)
            },
            //复选框全选
            selectAllRow(selection){
                console.log(selection)
            },
            showMore(){
                this.couldLook=true;
            },
            handleSizeChange(val){
                this.pageSize=val;
            },
            handleCurrentChange(val){
                this.pageNum=val;
            },
            //查询
            searchMore(){
                queryData.getData(searchMore,this.input,this,function(res){
                    var data=res.resp.content.data.result;
                    if(data!=null){
                        //默认选中行
                        //this.currentChange(this.tableData[0]);
                    }
                })
            },
            //默认选中变颜色
            FindRFirstDate(row){
                // console.log(row)
                this.$refs.tableData.setCurrentRow(row);
            },

        },
        created(){
            $(document).ready(function () {
                right.leftHeight = $(window).height() - 240;
            });
            $(window).resize(function () {
                right.leftHeight = $(window).height() - 240;
            });
        }
    })
}
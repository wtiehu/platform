/**
 * Created by admin on 2017/10/10.
 */
var basTop;
var left;
var leftBottom;
var right;
//组织机构右侧查询接口
var searchMore=serverPath + "/user/queryPage";
//角色右侧查询接口
var searchRole=serverPath + "/role/queryUsers";
//左侧查右侧查询接口
//var searchLeftMore=serverPath + "/user/queryByOrg";
//编辑查询
var editMore=serverPath + "/user/queryBySpecify";
//删除
var deleteMore=serverPath + "/user/delete";
//批量删除
var deleteALL=serverPath + "/user/deleteBatch";
//重置密码
var resetPass=serverPath + "/user/resetPasswordBatch";

//失效
var invalidUser=serverPath + "/user/outOfUseBatch";
//启用
var enableUser=serverPath + "/user/inUseBatch";
//解锁
var unlockUser=serverPath + "/user/unLock";
//锁定
var lockUser=serverPath + "/user/lock";

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
                divIndex = ibcpLayer.ShowDiv(htmlUrl, ' 添加人员信息', '50%', '98%',function(){

                });
            },
            //导出选择版本
            chooseVersion(){
                var htmlUrl = 'chooseVersion.html';
                divIndex = ibcpLayer.ShowDiv(htmlUrl, '选择版本', '300px', '200px',function(){

                });

            },
            //导入
            leadRow(){
                var htmlUrl = 'import_user.html';
                divIndex = ibcpLayer.ShowDiv(htmlUrl, '导入页面', '500px', '500px',function(){

                });
            },
            //导出
            exportRow(){
                var htmlUrl = 'personnel_export.html';
                divIndex = ibcpLayer.ShowDiv(htmlUrl, '导出Excel', '800px', '400px', function () {


                });
            },
            //重置密码
            resetPass(){
                restartPassword.restartPassword(function(){
                    var data={
                        "url":resetPass,
                        "jsonData":{rowId:right.userId},
                        "obj":basTop,
                        "showMsg":true
                    };
                    gmpAjax.showAjax(data,function(res){
                        //分页跳回到第一页
                        if(left.activeName=='first'){
                            right.searchMore()
                        }else if(left.activeName=='second'){
                            right.searchUserMore();
                        };
                    })
                })
            },
            //批量删除
            deleteAll(){
                deleteObj.del(function(){
                    var data={
                        "url":deleteALL,
                        "jsonData":{rowId:right.userId},
                        "obj":basTop,
                        "showMsg":true
                    };
                    gmpAjax.showAjax(data,function(res){
                        //分页跳回到第一页
                        if(left.activeName=='first'){
                            right.searchMore()
                        }else if(left.activeName=='second'){
                            right.searchUserMore();
                        }
                    })
                })
            },
            //失效
            Invalid(){
                Invalid.Invalid(function(){
                    var data={
                        "url":invalidUser,
                        "jsonData":{rowId:right.userId},
                        "obj":basTop,
                        "showMsg":true
                    };
                    gmpAjax.showAjax(data,function(res){
                        if(left.activeName=='first'){
                            right.searchMore()
                        }else if(left.activeName=='second'){
                            right.searchUserMore();
                        }
                    })
                })
            },
            //启用
            Enable(){
                Enable.Enable(function(){
                    var data={
                        "url":enableUser,
                        "jsonData":{rowId:right.userId},
                        "obj":basTop,
                        "showMsg":true
                    };
                    gmpAjax.showAjax(data,function(res){
                        if(left.activeName=='first'){
                            right.searchMore()
                        }else if(left.activeName=='second'){
                            right.searchUserMore();
                        }
                    })
                })
            },
        }
    });

    left=new Vue({
        el:'#left',
        data:getData.dataObj({
            config: {
                // 显示复选框
                checkbox:false,
                // 默认展开
                 //expanded: [324],
                // 展开所有节点
                expandedAll: true,
                // 默认选中项 当 checkbox 为 true 时  编辑时可以用
                //checked: [12, 21],
                // 配置显示项
                defaultProps: {
                    // 树节点显示文字
                    label: 'orgName',
                    // 节点id
                    key: "orgId",
                    // 父节点信息
                    parent: "orgPid",
                },
                // 获取数据接口
                url: serverPath + "/baseOrg/queryPage"
            },
            activeName:'first',
        }),
        methods:{
            getNodes(data){
                //console.log(data);
                this.rowId=data.rowId;
                right.searchUser();
            },
            //复选框点击
            getChecked(){
                console.log(data);
            },
            //tab页点击交换
            handleClick(){
                //判断点击的是第一还是第二
                //console.log(left.activeName)
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
            config1: {
                // 显示复选框
                checkbox:false,
                // 配置显示项
                defaultProps: {
                    // 树节点显示文字
                    label: 'roleName',
                    // 节点id
                    key: "rowId",
                },
                // 获取数据接口
                url: serverPath + "/role/queryPage"
            },
        }),
        methods:{
            handleNodeClick(data){
                //console.log(data);
            },
            handleClick(){

            },
            getNodes1(data){
                this.userRowId=data.rowId;
                right.searchUser();
            },
            //复选框点击
            getChecked1(){

            },

        }
    })




    right=new Vue({
        "el": "#right",
        data: getData.dataObj({
            select: '',//查询类
            chooseState: '',//状态
            couldLook:false,//状态能否被看见
        }),
        methods: {
            headSort(column){
                if(left.activeName=='first'){
                    if(this.select==''){//需要search
                        var param={
                            belongOrg:left.rowId
                        }
                        if(this.chooseState==''){//不需要状态
                            var params=JSON.stringify(param)
                        }else{//需要状态
                            param["status"] = this.chooseState;
                            var params=JSON.stringify(param)
                        }
                        var headDate={
                            search:this.input,
                            param:params,
                            pageNum:this.pageNum,
                            pageSize:this.pageSize,
                            order:'',
                        }
                        querySearch.headSorts(searchMore,headDate,column,this);
                    }else{  //不需要search
                        var param={
                            belongOrg:left.rowId
                        }
                        param[this.select] = this.input;
                        if(this.chooseState==''){//不需要状态
                            var params=JSON.stringify(param)
                        }else{//需要状态
                            param["status"] = this.chooseState;
                            var params=JSON.stringify(param)
                        }
                        var headDate={
                            param:params,
                            pageNum:this.pageNum,
                            pageSize:this.pageSize,
                            order:'',
                        }
                        querySearch.headSorts(searchMore,headDate,column,this);
                    }
                }else if(left.activeName=='second'){
                        if(this.select==''){//需要search
                            var param={};
                            if(this.chooseState==''){//不需要状态
                                params='';
                            }else{//需要状态
                                param["status"] = this.chooseState;
                                var params=JSON.stringify(param)
                            }
                            var headDate={
                                rowId:leftBottom.userRowId,
                                search:this.input,
                                param:params,
                                pageNum:this.pageNum,
                                pageSize:this.pageSize,
                                order:'',
                            }
                            querySearch.headSorts(searchMore,headDate,column,this);
                        }else{  //不需要search
                            var param={};
                            param[this.select] = this.input;
                            if(this.chooseState==''){//不需要状态
                                var params=JSON.stringify(param)
                            }else{//需要状态
                                param["status"] = this.chooseState;
                                var params=JSON.stringify(param)
                            }
                            var headDate={
                                rowId:leftBottom.userRowId,
                                search:this.input,
                                param:params,
                                pageNum:this.pageNum,
                                pageSize:this.pageSize,
                                order:'',
                            }
                            querySearch.headSorts(searchMore,headDate,column,this);
                        }
                }

            },
            //点击这一行
            currentChange(row, event, column){
                console.log(row);
                this.rightRowId=row.rowId
            },
            //选择复选框
            selectRow(selection, row){
                console.log(selection)
                right.userId=[];//多选的用户ID组
                $.each(selection,function(i,item){
                    right.userId.push(item.rowId)

                })
                console.log( right.userId)
            },
            //复选框全选
            selectAllRow(selection){
                right.userId=[];//多选的用户ID组
                $.each(selection,function(i,item){
                    right.userId.push(item.rowId)
                })
            },
            showMore(){
                this.couldLook=true;
            },
            handleSizeChange(val){
                //不跳回第一页
                this.pageSize=val;
                if(left.activeName=='first'){
                    right.searchMore()
                }else if(left.activeName=='second'){
                    right.searchUserMore();
                }
            },
            handleCurrentChange(val){
                this.pageNum=val;
                //不跳回第一页
                if(left.activeName=='first'){
                    right.searchMoreFirst()
                }else if(left.activeName=='second'){
                    right.searchUserMoreFirst();
                }
            },
            searchUser(){
                if(left.activeName=='first'){
                    right.searchMore()
                }else if(left.activeName=='second'){
                    right.searchUserMore();
                }
            },
            //查询组织机构下的用户  跳回第一页
            searchMore(){
                if(this.select==''){//需要search
                    var param={
                        belongOrg:left.rowId
                    }
                    if(this.chooseState==''){//不需要状态
                        var params=JSON.stringify(param)
                    }else{//需要状态
                        param["status"] = this.chooseState;
                        var params=JSON.stringify(param)
                    }
                    var headDate={
                        search:this.input,
                        param:params,
                        pageNum:1,
                        pageSize:this.pageSize,
                    }

                    querySearch.searchResourceFirst(searchMore,headDate,this,function(res){

                    })
                }else{  //不需要search
                    var param={
                        belongOrg:left.rowId
                    }
                    param[this.select] = this.input;
                    if(this.chooseState==''){//不需要状态
                        var params=JSON.stringify(param)
                    }else{//需要状态
                        param["status"] = this.chooseState;
                        var params=JSON.stringify(param)
                    }

                    var headDate={
                        param:params,
                        pageNum:1,
                        pageSize:this.pageSize,
                    }
                    querySearch.searchResourceFirst(searchMore,headDate,this,function(res){

                    })
                }
            },
            //查找角色下的用户  跳回第一页
            searchUserMore(){
                if(this.select==''){//需要search
                   var param={};
                    if(this.chooseState==''){//不需要状态
                        params='';
                    }else{//需要状态
                        param["status"] = this.chooseState;
                        var params=JSON.stringify(param)
                    }
                    var headDate={
                        rowId:leftBottom.userRowId,
                        search:this.input,
                        param:params,
                        pageNum:1,
                        pageSize:this.pageSize,
                    }
                    querySearch.searchResourceFirst(searchRole,headDate,this,function(res){
                        console.log(res);
                        var data=res.resp.content.data;
                        if(data!=null){
                            //默认选中行
                            //this.currentChange(this.tableData[0]);
                        }
                    })
                }else{  //不需要search
                   var param={};
                    param[this.select] = this.input;
                    if(this.chooseState==''){//不需要状态
                        var params=JSON.stringify(param)
                    }else{//需要状态
                        param["status"] = this.chooseState;
                        var params=JSON.stringify(param)
                    }
                    var headDate={
                        rowId:leftBottom.userRowId,
                        search:this.input,
                        param:params,
                        pageNum:1,
                        pageSize:this.pageSize,
                    }
                    querySearch.searchResourceFirst(searchRole,headDate,this,function(res){
                        console.log(res);
                        var data=res.resp.content.data;
                        if(data!=null){
                            //默认选中行
                            //this.currentChange(this.tableData[0]);
                        }
                    })
                }
            },
            //查询组织机构下的用户  不跳回第一页
            searchMoreFirst(){
                if(this.select==''){//需要search
                    var param={
                        belongOrg:left.rowId
                    }
                    if(this.chooseState==''){//不需要状态
                        var params=JSON.stringify(param)
                    }else{//需要状态
                        param["status"] = this.chooseState;
                        var params=JSON.stringify(param)
                    }
                    var headDate={
                        search:this.input,
                        param:params,
                        pageNum:this.pageNum,
                        pageSize:this.pageSize,
                    }

                    querySearch.searchResourceFirst(searchMore,headDate,this,function(res){

                    })
                }else{  //不需要search
                    var param={
                        belongOrg:left.rowId
                    }
                    param[this.select] = this.input;
                    if(this.chooseState==''){//不需要状态
                        var params=JSON.stringify(param)
                    }else{//需要状态
                        param["status"] = this.chooseState;
                        var params=JSON.stringify(param)
                    }

                    var headDate={
                        param:params,
                        pageNum:1,
                        pageSize:this.pageSize,
                    }
                    querySearch.searchResourceFirst(searchMore,headDate,this,function(res){

                    })
                }
            },
            //查找角色下的用户  不跳回第一页
            searchUserMoreFirst(){
                if(this.select==''){//需要search
                    var param={};
                    if(this.chooseState==''){//不需要状态
                        params='';
                    }else{//需要状态
                        param["status"] = this.chooseState;
                        var params=JSON.stringify(param)
                    }
                    var headDate={
                        rowId:leftBottom.userRowId,
                        search:this.input,
                        param:params,
                        pageNum:this.pageNum,
                        pageSize:this.pageSize,
                    }
                    querySearch.searchResourceFirst(searchRole,headDate,this,function(res){
                        console.log(res);
                        var data=res.resp.content.data;
                        if(data!=null){
                            //默认选中行
                            //this.currentChange(this.tableData[0]);
                        }
                    })
                }else{  //不需要search
                    var param={};
                    param[this.select] = this.input;
                    if(this.chooseState==''){//不需要状态
                        var params=JSON.stringify(param)
                    }else{//需要状态
                        param["status"] = this.chooseState;
                        var params=JSON.stringify(param)
                    }
                    var headDate={
                        rowId:leftBottom.userRowId,
                        search:this.input,
                        param:params,
                        pageNum:1,
                        pageSize:this.pageSize,
                    }
                    querySearch.searchResourceFirst(searchRole,headDate,this,function(res){
                        console.log(res);
                        var data=res.resp.content.data;
                        if(data!=null){
                            //默认选中行
                            //this.currentChange(this.tableData[0]);
                        }
                    })
                }
            },
            //默认选中变颜色
            FindRFirstDate(row){
                // console.log(row)
                this.$refs.tableData.setCurrentRow(row);
            },
            //编辑
            editEvent(){
                operate = 2;
                var htmlUrl = 'personnel_add.html';
                divIndex = ibcpLayer.ShowDiv(htmlUrl, ' 编辑人员信息', '600px', '660px',function(){
                    //调用接口
                    var data={
                        "url":editMore,
                        "jsonData":{rowId:right.rightRowId},
                        "obj":right,
                        "showMsg":true
                    };
                    gmpAjax.showAjax(data,function(res){
                        //编辑拿到的数据
                        var data=res.data[0];
                        console.log(data)
                        right.userowId=data.rowId;//用户的ID号码
                        useAdd.id=data.id;//工号
                        useAdd.name=data.name;//姓名
                        useAdd.nickname=data.nickname;//昵称
                        useAdd.password=data.password;//初始密码有默认值
                        useAdd.config.checked=data.belongOrg;//所属部门
                        useAdd.belongOrg=data.belongOrg;//所属部门 提交的时候要的
                        useAdd.idCard=data.idCard;//身份证
                        useAdd.mobilePhone=data.mobilePhone;//移动电话
                        useAdd.officePhone=data.officePhone//办公电话
                        useAdd.email=data.email;//邮箱
                        useAdd.gender=data.gender;//性别
                        useAdd.job=data.job;//职务
                        useAdd.hiredate=data.hiredate;//入职日期
                        useAdd.description=data.description;//说明
                        useAdd.remarks=data.remarks;//备注
                        console.log( useAdd.config.checked)

                    })
                });
            },
            //删除
            deleteEvent(){
                deleteObj.del(function(){
                    var data={
                        "url":deleteMore,
                        "jsonData":{rowId:right.rightRowId},
                        "obj":right,
                        "showMsg":true
                    };
                    gmpAjax.showAjax(data,function(res){
                        //分页跳回到第一页
                        if(left.activeName=='first'){
                            right.searchMore()
                        }else if(left.activeName=='second'){
                            right.searchUserMore();
                        }
                    })
                })
            },
            //解锁
            unlockEvent(){
                unlockEvent.unlockEvent(function(){
                    var data={
                        "url":unlockUser,
                        "jsonData":{rowId:right.rightRowId},
                        "obj":basTop
                    };
                    gmpAjax.showAjax(data,function(res){
                        if(left.activeName=='first'){
                            right.searchMore()
                        }else if(left.activeName=='second'){
                            right.searchUserMore();
                        }
                    })
                })
            },
            //锁定
            lockEvent(){
                lockEvent.lockEvent(function(){
                    var data={
                        "url":lockUser,
                        "jsonData":{rowId:right.rightRowId},
                        "obj":basTop
                    };
                    gmpAjax.showAjax(data,function(res){
                        if(left.activeName=='first'){
                            right.searchMore()
                        }else if(left.activeName=='second'){
                            right.searchUserMore();
                        }
                    })
                })
            }
        },
        created(){
            $(document).ready(function () {
                right.leftHeight = $(window).height() - 210;
            });
            $(window).resize(function () {
                right.leftHeight = $(window).height() - 210;
            });

        }
    })
}
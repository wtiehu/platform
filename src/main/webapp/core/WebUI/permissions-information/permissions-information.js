/**
 * Created by andim on 2017/10/19.
 */
var basTop;
var left;
var right;
var rightBottom;
var basRightTop;
var basRight;

//权限信息查询接口
var roleInformation = serverPath + "/permission/queryPage";

//权限指定字段查询接口
var selUrl = serverPath + "/permission/queryTypePermission";

//查看权限类型下的权限信息
var permissionsInformation = serverPath + "/permission/queryTypePermission";

//查看权限类型下的角色信息
var personnelInformationInterface = serverPath + "/permission/queryRole";

//角色编辑接口
var modify = serverPath + "/role/modify";

//角色删除接口
var deleteUrl = serverPath + "/role/delete";

gmp_onload=function(){
    //顶部按钮
    basTop = new Vue({
        el: '#basTop',
        data: {
            addOpe: false,
            takeEffect: false,
            divIndex:"",
            disabled:true
        },
        methods: {
            //新增人员信息
            addEvent() {
                var htmlUrl = 'add-role-information-maintenance.html';
                this.divIndex = ibcpLayer.ShowDiv(htmlUrl, ' 新增角色信息', '400px', '460px',function(){

                });
            },
            //删除角色信息
            orgDelete(){
                deleteObj.del(function(){
                    var data = {
                        "url":deleteUrl,
                        "jsonData":{rowId:left.rowId},
                        "obj":basTop,
                        "showMsg":true
                    }
                    gmpAjax.showAjax(data,function(res){
                        // queryData.getData(dataBase.url,dataBase.input,dataBase)
                        left.$refs.org.getNode();
                        basTop.disabled = true;
                    })
                })
            },
            //生效
            affectProp(){
                //var data={
                //    "url":affectPropUrl,
                //    "jsonData":{rowId:basLeft.currentId},
                //    "obj":basTop,
                //};
                //gmpAjax.showAjax(data,function(res){
                //    basLeft.searchLeft();
                //})
            },
            //保存
            addClick(){
                right.addClick();
            }
        }
    });

    //左侧树
    left=new Vue({
        el:'#left',
        data:getData.dataObj({
            treeData: {
                // 是否显示checkbook 默认为不显示
                checkbox: true,
                expandedAll: true,
                // 获取树节点接口
                url: roleInformation,
                // 设置参数 -- 树节点上显示的文字
                defaultProps: {
                    // 树节点显示文字
                    label: 'permissionName',
                    // 节点id
                    key: "rowId",
                    // 父节点信息
                    // parent: "orgPid",
                    // // 当前节点信息
                    // selfId: "orgId",
                }
            },
            rowIdArr:[0],
        }),
        methods:{
            //点击左边的树得到数据
            getNodes(data) {
                console.log(data);
                this.rowId=data.rowId;
                rightBottom.permissionType = data.permissionType;
                basTop.disabled = false;
                rightBottom.disabled = false;
                // basTop.orgDeleteData = false;
                basRightTop.PersonnelInformation(data.permissionType);
                basRightTop.roleInformation(data.rowId);
            },
            //复选框选中得到得值
            getChecked(data) {
                console.log(data);
                basTop.disabled = false;
                rightBottom.disabled = false;
                var arr = this.rowIdArr;
                for(var i=0;i<arr.length;i++){
                    if(data.rowId != arr[i]){
                        if(i==arr.length-1){
                            arr.push(data.rowId);
                            console.log(this.rowIdArr);
                        }
                    }
                }
            }
        },
        created(){
            $(document).ready(function () {
                var height = $(window).height()-70;
                $("#allBorderHeight").height(height);
            });
            $(window).resize(function () {
                var height1 = $(window).height()-70;
                $("#allBorderHeight").height(height1);
            });
        }
    })

    //详细信息
    right=new Vue({
        "el": "#right",
        data: getData.dataObj({
            labelPosition:'right',
            formTable:{
                roleId:"",
                roleName:"",
                roleType:"",
                desc:"",
                remarks:"",
            },
            rowId:""
        }),
        methods: {
            editTbleBase(rowId){
                var data = {"url":modify,"jsonData":{
                    rowId:rowId,
                    roleName:this.formTable.roleName,
                    roleId:this.formTable.roleId,
                    roleType:this.formTable.roleType,
                    desc:this.formTable.desc,
                    remarks:this.formTable.remarks,
                },
                    "obj":right,
                    "showMsg":true
                }
                gmpAjax.showAjax(data,function(res){
                    console.log(res);
                    left.$refs.org.getNode();
                })
            },
            addClick(){
                editObj.editOk(function(){
                    right.editTbleBase(right.rowId);
                })
            }
        }
    })

    //详细信息
    rightBottom=new Vue({
        el:'#rightBottom',
        data:getData.dataObj({
            activeName:'first',
            disabled:true,
            searchInput:"",
            select:"",
            permissionType:"",
        }),
        methods:{
            //查询框点击
            searchClick(){
                if(this.select != ""){
                    var param = {};
                    param[this.select] = this.searchInput;
                    basRightTop.PersonnelInformation(this.permissionType,1,null,param);
                }else{
                    basRightTop.PersonnelInformation(this.permissionType,1,this.select,null);
                }
            },
            //tab页点击交换
            handleClick(tablePageName){

            },
            //点击
            firstClick(){

            },
            //表点击
            twoClick(){

            },
            //分页信息
            handleSizeChange(val){
                //alert("点击每页显示多少条");
                this.pageSize = val;
            },
            handleCurrentChange(val){
                //alert("当前第几页");
                var strArr = '["'+right.rowId+'"]';
                console.log(strArr);
                querySearch.jumpPage(PersonnelInformationUrl,strArr,this,val,function(res){
                    console.log(res);
                })
            },
        },
        created(){
            $(document).ready(function () {
                rightBottom.leftHeight = $(window).height() - 235;
            });
            $(window).resize(function () {
                rightBottom.leftHeight = $(window).height() - 235;
            });
        }
    })

    //角色信息
    basRightTop = new Vue({
        el:"#basRightTop",
        template:'#tempBlock',
        data:getData.dataObj({
            searchInput:"",
            select:"",
        }),
        methods:{
            //点击行
            twoClick(){

            },
            //角色查看
            roleView(rowId){
                var strArr = '["'+rowId+'"]';
                console.log(strArr);
                $.ajax({
                    url:roleViewUrl,
                    type:"get",
                    data:{
                        param:strArr
                    },
                    dataType:"json",
                    xhrFields: {withCredentials: true},
                    success:function(res){
                        console.log(res.resp.content.data)
                        rightBottom.loading=false;
                        rightBottom.tableDataTwo = res.resp.content.data;//数据源
                    },
                })
            },
            //分页信息
            handleSizeChange(val){
                this.pageSize = val;
                this.PersonnelInformation(right.rowId);
            },
            handleCurrentChange(val){
                this.pageNum = val;
                this.PersonnelInformation(right.rowId,val);
            },
            //权限信息查询
            PersonnelInformation(permissionType,numberPage,search,param){
                var page = 1;
                var data = null;
                if(numberPage){
                    page = numberPage;
                }
                var type = permissionType;
                if(search != null){
                    data = {
                        "permissionType":type,
                        "search":search,
                    }
                }else{
                    data = {
                        "permissionType":type
                    }
                }
                if(param != null){
                    var strParam = JSON.stringify(param);
                    data = {
                        "permissionType":type,
                        "param":strParam,
                    }
                }else{
                    data = {
                        "permissionType":type
                    }
                }
                querySearch.getDataPage(permissionsInformation,data,rightBottom,page,function(res){
                    console.log(res);
                })
            },
            //角色信息查询
            roleInformation(rowId,numberPage,search,param){
                var page = 1;
                var data = {};
                if(numberPage){
                    page = numberPage;
                }
                if(search != null){
                    data = {
                        "rowId":rowId,
                        "search":search
                    }
                }else{
                    data = {
                        "rowId":rowId
                    }
                }
                if(param != null){
                    var strParam = JSON.stringify(param);
                    data = {
                        "rowId":rowId,
                        "param":strParam
                    }
                }else{
                    data = {
                        "rowId":rowId
                    }
                }
                querySearch.getDataPage(personnelInformationInterface,data,basRightTop,page,function(res){
                    console.log(res);
                })
            },
            //角色信息查询按钮
            searchClick(){
                alert("in");
            }
        },
        created(){
            $(document).ready(function () {
                basRightTop.leftHeight = $(window).height() - 235;
            });
            $(window).resize(function () {
                basRightTop.leftHeight = $(window).height() - 235;
            });
        }
    })

}
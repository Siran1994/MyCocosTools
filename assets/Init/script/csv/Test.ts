import { _decorator, Component, Node } from 'cc';
import { CsvManager } from '../other/CsvManager';
import { DataManager } from '../manager/DataManager';
const { ccclass, property } = _decorator;

@ccclass( 'Test' )
export class Test extends Component
{
    start ()
    {
        CsvManager.Instance.LoadCsv( () =>
        {
            //console.error( CsvManager.Instance.getTable( 'talk' ) );
            //console.error( CsvManager.Instance.queryByID( 'talk', '1' )[ 'content' ] );

            // console.error( CsvManager.Instance.getTableArr( 'talk' ) );
            // console.error( CsvManager.Instance.showTalk( 1 ) );

            //console.error( CsvManager.Instance.getTable( 'signIn' ) );
            //console.error( CsvManager.Instance.getTable( 'car' ) );



            // const row = CsvManager.Instance.queryByID( 'talk', '1' );
            // if ( row )
            // {
            //     console.error( `内容: ${ row.content }` ); // 输出: 你好,请到街对面接我.
            //     console.error( `条件: ${ row.condition }` ); // 输出: true
            // }

            // // 查询 talk 表中，字段 "content" 包含 "停车" 的第一条数据
            // const row1 = CsvManager.Instance.queryOne( 'talk', 'content', '停车!停车!' );
            // if ( row1 )
            // {
            //     console.error( `ID: ${ row1.type }` ); // 输出: 2
            //     console.error( `数组: ${ row1.content1 }` ); // 输出: [apple,banana,oriage]
            // }

            // 注意：csv解析后，TRUE/false 会被转为 布尔类型
            const rows = CsvManager.Instance.queryAll( 'talk', 'condition', true );
            // 遍历结果 (rows 是一个对象，需要用 Object.values 或者 for...in 遍历)
            for ( const key in rows )
            {
                const item = rows[ key ];
                console.error( `找到任务条件为True的ID: ${ item.type }, 内容: ${ item.content }` );
            }

            // 转换为数组
            const resultArr = Object.keys( rows ).map( key => rows[ key ] );
            // 现在可以使用数组方法
            resultArr.forEach( item =>
            {
                console.error( item.content );
                console.error( item.type );
                console.error( item.condition );
                if ( item.condition == true )
                    console.error( '对的' );
                else
                    console.error( '错的' );
                console.error( item.numList );
                console.error( item.numList[ 0 ] );
                console.error( item.numList[ 1 ] );
                console.error( item.numList[ 2 ] );

                console.error( item.strList );
                console.error( item.strList[ 0 ] );
                console.error( item.strList[ 1 ] );
                console.error( item.strList[ 2 ] );
            } );

            // // 查询 talk 表中，类型(type) 为 1, 5, 10 的所有数据
            // const typeList = [ 1, 5, 10 ];
            // const rows1 = CsvManager.Instance.queryIn( 'talk', 'type', typeList );
            // for ( const key in rows1 )
            // {
            //     const item = rows1[ key ];
            //     console.error( `在列表中的ID: ${ item.type }, 内容: ${ item.content }` );
            // }

            // 查询条件：type 必须是 [1, 2, 3] 中的某一个
            // 并且 condition 必须是 [true] 中的某一个 (即 true)
            // const condition = {
            //     type: [ 1, 2, 3 ],
            //     condition: [ true ]
            // };
            // const rows2 = CsvManager.Instance.queryByCondition( 'talk', condition );
            // console.error( "符合复合条件的数据:" );
            // for ( const key in rows2 )
            // {
            //     const item = rows2[ key ];
            //     console.error( `Type: ${ item.type }, Content: ${ item.content }, Condition: ${ item.condition }` );
            // }
        } );//Excel表格使用示例

        DataManager.Instance.setItem( 'name', '狂战士' );
        DataManager.Instance.setItem( 'skill', '大蹦' );
        DataManager.Instance.setItem( 'desc', '擅长使用巨剑的鬼剑士' );
        DataManager.Instance.setItem( 'atk', 100 );
        DataManager.Instance.setItem( 'hp', 200 );
        DataManager.Instance.setItem( 'def', 50 );

        console.log( DataManager.Instance.getAll() );
    }

}


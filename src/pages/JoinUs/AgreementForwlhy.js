import React, { PureComponent } from 'react';
import { Form, Card,} from 'antd/lib/index';
import styles from '../../layouts/Sword.less';

@Form.create()
class AgreementForwlhy extends PureComponent {
  state = {
    data: {},
  };

  componentWillMount() {
  };

  render() {

    const { data } = this.state;

    const formItemLayout = {
      labelCol: {
        xs:{ span: 24 },
        sm:{ span: 7 },
      },
      wrapperCol: {
        xs: { span : 24 },
        sm: { span : 12},
        md: { span : 10},
      },
    };

    return (
      <div className={styles.main}>

        <Card className={styles.card} bordered={false}>

          <h3 align="center">用户注册协议</h3>
          <p>&emsp;&emsp;尊敬的客户您好，欢迎您访问<u>山西物迹福达科技有限公司</u>网站（以下简称：网站或APP）。在您注册成为网站会员之前，请您务必认真阅读和理解《网站用户注册协议》（以下简称：协议）中所有的条款。您须完全同意协议中所有的条款，才可以注册成为本网站的会员，使用里面的服务。您在网站的注册和操作均将被视为是您对协议所有条款及内容的自愿接受。</p>
          <p>一、声明</p>
          <p>（一）网站内在线产品的所有权归<u>山西物迹福达科技有限公司</u>所有。</p>
          <p>（二）您在网站进行注册时，一旦点击“我接受”按钮，即表示为您已自愿接受协议中所有的条款和内容。</p>
          <p>（三）协议条款的效力范围仅限于本网站，您在网站的行为均受协议的约束。</p>
          <p>（四）您使用网站服务的行为，即被视为您已知悉本网站的相关公告并同意。</p>
          <p>（五）本网站有权在未提前通知您的情况下修改协议的条款，您每次进入网站在使用服务前，都应先查阅一遍协议。</p>
          <p>（六）本网站有权在未提前通知您的情况下修改、暂停网站部分或全部的服务，且不承担由此产生来自您和第三方的任何责任。</p>
          <p>（七）本网站提供免费注册服务，您的注册均是自愿行为，注册成功后，您可以得到网站更加完善的服务。</p>
          <p>（八）您注册成为会员后账户和密码如有灭失，不会影响到您已办理成功业务的效力，本网站可恢复您的注册账户及相关信息但不承担除此以外的其它任何责任。</p>
          <p>二、用户管理</p>
          <p>（一）您在本网站的所有行为都须符合中国的法律法规，您不得利用本网站提供的服务制作、复制、发布、传播以下信息：</p>
          <p>1、反对宪法基本原则的；</p>
          <p>2、危害国家安全、泄露国家秘密、颠覆国家政权、破坏国家统一的；</p>
          <p>3、损害国家荣誉和利益的；</p>
          <p>4、煽动民族仇恨、民族歧视、破坏民族团结的；</p>
          <p>5、破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
          <p>6、散布谣言、扰乱社会秩序、破坏社会稳定的；</p>
          <p>7、散布淫秽、色情、赌博、暴力、凶杀、恐怖内容或者教唆犯罪的；</p>
          <p>8、侮辱或者诽谤他人，侵害他人合法权益的；</p>
          <p>9、以及法律、法规禁止的其他内容。</p>
          <p>（二）您在本网站的行为，还必须符合其它国家和地区的法律规定以及国际法的有关规定。</p>
          <p>（三）不得利用本网站从事以下活动：</p>
          <p>1、未经允许，进入他人计算机信息网络或者使用他人计算机信息网络的资源；</p>
          <p>2、未经允许，对他人计算机信息网络的功能进行删除、修改或增加；</p>
          <p>3、未经允许，对他人计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加；</p>
          <p>4、制作、故意传播计算机病毒等破坏性程序的；</p>
          <p>5、其他危害计算机信息网络安全的行为。</p>
          <p>（四）遵守本网站其他规定和程序：</p>
          <p>1、您对自己在本网站中的行为和操作承担全部责任；</p>
          <p>2、您承担责任的形式包括但不仅限于，对受到侵害者进行赔偿、在本网站首先承担了因您的行为导致的行政处罚或侵权损害赔偿责任后，您应给予本网站的等额赔偿；</p>
          <p>3、如果本网站发现您传输的信息含有本协议所规定的内容，本网站有权在不通知您的情况下采取包括但不仅限于向国家有关机关报告、保存有关记录、删除该内容及链接地址、关闭服务器、暂停您账号的操作权限、停止向您提供服务等措施。</p>
          <p>三、注册会员权利和义务</p>
          <p>（一）注册会员有权用本网站提供的服务功能。</p>
          <p>（二）注册会员同意遵守包括但不仅限于《中华人民共和国保守国家秘密法》、《中华人民共和国计算机信息系统安全保护条例》、《计算机软件保护条例》、《互联网电子公告服务管理规定》、《互联网信息服务管理办法》等在内的法律、法规。</p>
          <p>（三）您注册时有义务提供完整、真实、的个人信息，信息如有变更，应及时更新。</p>
          <p>（四）您成为注册会员须妥善保管用户名和密码，用户登录后进行的一切活动均视为是您本人的行为和意愿，您负全部责任。</p>
          <p>（五）您在使用本网站服务时，同意且接受本网站提供的各类信息服务。</p>
          <p>（六）您使用本网站时，禁止有以下行为：</p>
          <p>1、上载、张贴、发送电子邮件或以其他方式传送含有违反国家法律、法规的信息或资料，这些资料包括但不仅限于资讯、资料、文字、软件、音乐、照片、图形、等（下同）；</p>
          <p>2、散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的资料；</p>
          <p>3、冒充任何个人或机构，或以虚伪不实的方式误导他人以为其与任何人或任何机构有关；</p>
          <p>4、通过本网站干扰、破坏或限制他人计算机软件、硬件或通讯设备功能的行为；</p>
          <p>5、通过本网站跟踪或以其他方式骚扰他人。</p>
          <p>四、用户隐私</p>
          <p>&emsp;&emsp;我们承诺，对您个人的信息和隐私的安全承担保密义务。未经您授权或同意，本网站不会将您的个人资料信息泄露给第三方，但以下情况除外，且本网站不承担任何责任：</p>
          <p>（一）政府单位按照中华人民共和国的法律、行政法规、部门规章、司法解释等规范性法律文件（统称“法律法规”），要求本网站提供的。</p>
          <p>（二）由于您将用户和密码告知或泄露给他人，由此导致的个人资料泄露。</p>
          <p>（三）包括但不仅限于黑客攻击、计算机病毒侵入或发作、政府管制等不可抗力而造成的用户个人资料泄露、丢失、被盗用或被篡改等。</p>
          <p>（四）为免除他人正在遭受威胁到其生命、身体或财产等方面的危险，所采取的措施。</p>
          <p>（五）本网站会与其他网站链接，但不对其他网站的隐私政策及内容负责。</p>
          <p>（六）此外，您若发现有任何非法使用您的用户账号或安全漏洞的情况，应立即通告本网站。</p>
          <p>（七）由于您自身的疏忽、大意等过错所导致的。</p>
          <p>（八）您在本网站的有关记录有可能成为您违反法律法规和本协议的证据。</p>
          <p>五、知识产权</p>
          <p>&emsp;&emsp;本网站所有的域名、商号、商标、文字、视像及声音内容、图形及图像均受有关所有权和知识产权法律的保护，未经本网站事先以书面明确允许，任何个人或单位，均不得进行复制和使用。</p>
          <p>六、法律适用</p>
          <p>（一）协议由本网站的所有人负责修订，并通过本网站公布，您的注册行为即被视为您自愿接受协议的全部条款，受其约束。</p>
          <p>（二）协议的生效、履行、解释及争议的解决均适用中华人民共和国法律。</p>
          <p>（三）您使用网站提供的服务如产生争议，原则上双方协商解决，协商不成可向<u>山西物迹福达科技有限公司所在地</u>仲裁机构申请仲裁或<u>山西物迹福达科技有限公司所在地</u>人民法院提起诉讼。</p>
          <p>（四）协议的条款如与法律相抵触，本网站可进行重新解析，而其他条款则保持对您产生法律效力和约束。</p>
        </Card>
      </div>
    );
  }
}

export default AgreementForwlhy;

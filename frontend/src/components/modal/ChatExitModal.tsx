import React from 'react';
import '../../style/modal/_Modal.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation} from "@fortawesome/free-solid-svg-icons";



export default function ChatExitModal(props)  {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, info } = props;

  const onCloseModal = (e) => {
    if (e.target === e.currentTarget){
      close();
    }
  }

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.

    <div className={open ? 'openModal modal' : 'modal'} onClick={onCloseModal}>
    {open ? (
      <section>

        <div style={{margin: "5%"}}>

          <div>
              <div>
                <FontAwesomeIcon  icon={faCircleExclamation} size="6x" color="#0064FF"/>
              </div>

              <div>
                  <p>나가긱</p>
                  <p>{info}</p>
              </div>

          </div>

          <main>
            <button onClick={close} >확인</button>
          </main>

        </div>

        

      </section>
    ) : null}
    </div>
  );

}
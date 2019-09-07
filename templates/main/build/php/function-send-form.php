<?php

if(isset($_POST)) {
	
	extract($_POST);
	
	ob_start();

  // Подключаем tpl шаблон письма
	require('../mail-tpl/'.$template.".tpl");

	$body = ob_get_contents();

   	ob_end_clean();

	try{
    //путь до конфигурационного файла для вашего smtp сервера
		require_once('config.php'); 

    //путь до класса phpmailer
		require_once('phpmailer/PHPMailerAutoload.php'); 

   		 $mail = new PHPMailer(true);

  		 $mail->IsSMTP();
  		 $mail->Host       = $__smtp['host'];
    	 $mail->SMTPDebug  = $__smtp['debug'];
    	 $mail->SMTPAuth   = $__smtp['auth'];
    	 $mail->Port       = $__smtp['port'];
   		 $mail->SMTPSecure = $__smtp['secure'];
       $mail->CharSet    = "UTF-8";
       $mail->Username   = $__smtp['username'];
       $mail->Password   = $__smtp['password'];
       //кому письмо
    	 $mail->AddAddress($__smtp['addreply']);                
    	 // $mail->AddReplyTo($email, $name);
       //от кого (желательно указывать свой реальный e-mail на используемом SMTP сервере
    	 $mail->SetFrom($__smtp['username'], $subject); 
    	 $mail->Subject = $subject;
    	 $mail->MsgHTML($body);
       if (isset($_FILES)) {
       foreach ($_FILES as $key => $value) {
        if ($value['tmp_name']!="") {
          $mail->AddAttachment($value['tmp_name'],$key."-".$value['name']);
        }
       }
       }
    	 $mail->Send();
       echo $return_msg;
  }
  catch (Exception $e) {
    print_r($mail->ErrorInfo);
    // Обрабатываем неудачную отправку
  }
}

 ?>
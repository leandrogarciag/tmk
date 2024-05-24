DELIMITER ;
CREATE TRIGGER trigger_cambio_auxiliar
BEFORE UPDATE ON tbl_usuarios FOR EACH ROW
BEGIN
	IF OLD.USU_CAUXILIAR <> NEW.USU_CAUXILIAR THEN
		SET NEW.USU_CFECHA_CAMBIO_AUXILIAR = now();
   
		INSERT INTO tbl_registro_usuarios (FKREGU_PKUSU_NCODIGO,REGU_CUSUARIO, REGU_CDOCUMENTO, REGU_CAUXILIAR,REGU_FECHA_INICIO, REGU_FECHA_FIN,REGU_TIEMPO)
		values (OLD.PKUSU_NCODIGO, OLD.USU_CUSUARIO, OLD.USU_CDOCUMENTO, OLD.USU_CAUXILIAR, OLD.USU_CFECHA_CAMBIO_AUXILIAR, NOW(), SEC_TO_TIME(TIMESTAMPDIFF(SECOND,OLD.USU_CFECHA_CAMBIO_AUXILIAR, NOW() )));
																														
     END IF;
END $$
DELIMITER ;
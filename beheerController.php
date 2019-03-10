<?php 

//include de db connectie
//TODO: maak een constructor hiervoor aan
require_once ($_SERVER['DOCUMENT_ROOT'] . "/controllers/database/connection.php");

	
	class beheerController {
		
		/**
		 * Laad alle eenheden in
		 * 
		 * @return	alle eenheden uit de tabel
		 */
		function laadEenheden() {
			try {
				$db_class = new db_class();
				$connection = $db_class->db_connection();
				
				$result = array();

			
				$sql = "SELECT * FROM eenheid";
				
				$stmt = $connection->prepare($sql);
				$stmt->execute();
				
				//plaats het resultaat in een array
				$i = 0;
				foreach($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
					$result[$i] = $row;
					$i++;
				}
				
				//forceer een JSON array
				$result = json_encode($result, JSON_FORCE_OBJECT);
				return $result;
				
			} catch (PDOException $e) {
				echo 'Error bij select' . $e->getMessage();
			}
		}
		
		/**
		 * Wijzig een eenheid
		 *
		 * @param	$eenheid 	de nieuwe value
		 * @param	$eenheidId 	de id van d eenheid die gewijzigd moet worden
		 *
		 */
		function editEenheid($eenheid, $eenheidId) {
			try {
				$db_class = new db_class();
				$connection = $db_class->db_connection();
			
			
				$sql = "
					UPDATE eenheid 
					SET eenheid = :eenheid
					WHERE eenheidId = :eenheidId
				";
				
				$stmt = $connection->prepare($sql);
				
				$stmt->execute(array(
					':eenheidId' => $eenheidId,
					':eenheid' => $eenheid
				));

			} catch (PDOException $e) {
				echo 'Error bij edit' . $e->getMessage();
			}
		}
		
		
		/**
		 * Slaat een eenheid op in de database
		 *
		 * @param	$eenheid 	de eenheid die opgeslagen moet worden
		 *
		 */
		function insertEenheid($eenheid) {
			try {
				$db_class = new db_class();
				$connection = $db_class->db_connection();

			
				$sql = "
					INSERT INTO eenheid 
					(eenheid) 
					VALUES (:eenheid)
				";
				
				$stmt = $connection->prepare($sql);
				
				$stmt->execute(array(
					':eenheid' => $eenheid
				));

			} catch (PDOException $e) {
				echo 'Error bij edit' . $e->getMessage();
			}
		}

		/**
		 * Delete een eenheid uit de database
		 *
		 * @param	$eenheidId 	de id van de eenheid die verwijderd moet worden
		 *
		 */
		function deleteEenheid($eenheidId) {
			try {
				$db_class = new db_class();
				$connection = $db_class->db_connection();
			
			
				$sql = "
					DELETE FROM eenheid
					WHERE eenheidId = :eenheidId
				";
				
				$stmt = $connection->prepare($sql);
				$stmt->execute(array(
					':eenheidId' => $eenheidId
				));

			} catch (PDOException $e) {
				echo 'Error bij delete' . $e->getMessage();
			}
		}
		
		/**
		 * Laad alle gebruikers in
		 * 
		 * @return	alle gebruikers uit de tabel
		 */
		function laadAlleGebruikers() {
			
			try {
				$db_class = new db_class();
				$connection = $db_class->db_connection();
				
				$result = array();

			
				$sql = "
					SELECT g.gebruikerId, g.gebruikerEmail, g.gebruikerWachtwoord, g.gebruikerVoornaam, g.gebruikerTussenvoegsel, g.gebruikerAchternaam, g.gebruikerTelefoonnummer, gr.rol
					FROM gebruiker g
					INNER JOIN gebruikersrol gr ON gr.rolId = g.rolId;
				";
				
				$stmt = $connection->prepare($sql);
				$stmt->execute();
				
				//plaats het resultaat in een array
				$i = 0;
				foreach($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
					$result[$i] = $row;
					$i++;
				}
				
				//forceer een JSON array
				return $result;
				
			} catch (PDOException $e) {
				echo 'Error bij select' . $e->getMessage();
			}
		}
		
		/**
		 * Slaat een gebruiker op in de database met een 'first-time' wachtwoord
		 *
		 * @param	$gebruikerVoornaam 			de voornaam van de gebruiker
		 * @param	$gebruikerTussenvoegsel 	de voorvoegsel van de gebruiker (kan null zijn)
		 * @param 	$gebruikerAchternaam 		de eenheid die opgeslagen moet worden
		 * @param	$gebruikerTelefoonnummer 	het telefoonnummer van de gebruiker
		 * @param 	$gebruikerMailadres 		het email adres van de gebruiker
		 * @param	$rolId 						de rol van de gebruiker
		 * 
		 * @return   succesvol geinsert
		 *
		 */
		function insertGebruiker($gebruikerVoornaam, $gebruikerTussenvoegsel, $gebruikerAchternaam, $gebruikerTelefoonnummer, $gebruikerMailadres, $rolId) {
			
			try {
				$db_class = new db_class();
				$connection = $db_class->db_connection();
			
			
				$sql = "
					INSERT INTO gebruiker 
					(gebruikerEmail, gebruikerWachtwoord, gebruikerVoornaam, gebruikerAchternaam, gebruikerTussenvoegsel, gebruikerTelefoonnummer, rolId)  
					VALUES (:email, :wachtwoord, :voornaam, :achternaam, :tussenvoegsel, :telefoonnummer, :rol);
				";
				
				//first time wachtwoord
				$wachtwoord = "First_44#Timer";
				$wachtwoord = password_hash ($wachtwoord, PASSWORD_DEFAULT);
				
				$stmt = $connection->prepare($sql);
				
				$stmt->execute(array(
					':email' => $gebruikerMailadres,
					':wachtwoord' => $wachtwoord,
					':voornaam' => $gebruikerVoornaam,
					':achternaam' => $gebruikerAchternaam,
					':tussenvoegsel' => $gebruikerTussenvoegsel,
					':telefoonnummer' => $gebruikerTelefoonnummer,
					':rol' => $rolId
				));

				//alles is gelukt!
				return 'succes';
				
			} catch (PDOException $e) {
				echo 'Error bij edit' . $e->getMessage();
			}
		}
		
		/**
		 * Haal al de rollen op uit de database
		 *
		 * @return	return alle rollen
		 *
		 */
		function getRollen() {

			try {
				$db_class = new db_class();
				$connection = $db_class->db_connection();
			
				$sql = "
					SELECT *  
					FROM gebruikersrol;
				";
				
				$stmt = $connection->prepare($sql);
				$stmt->execute();
				
				//plaats het resultaat in een array
				$i = 0;
				foreach($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
					$result[$i] = $row;
					$i++;
				}
				
				//forceer een JSON array
				$result = json_encode($result, JSON_FORCE_OBJECT);
				return $result;
				
			} catch (PDOException $e) {
				echo 'Error bij select' . $e->getMessage();
			}
		}
	}

?>
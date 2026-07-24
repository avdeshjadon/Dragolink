package com.dragolink.controller;

import com.dragolink.entity.ContactMessage;
import com.dragolink.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageRepository contactMessageRepository;

    // Public endpoint for submitting a contact message
    @PostMapping("/public/contact")
    public ResponseEntity<?> submitContactMessage(@RequestBody ContactMessage message) {
        if (message.getFirstName() == null || message.getLastName() == null || message.getEmail() == null || message.getMessage() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
        }
        message.setStatus("NEW");
        ContactMessage saved = contactMessageRepository.save(message);
        return ResponseEntity.ok(saved);
    }

    // Admin endpoints for managing contact messages
    @GetMapping("/admin/contact-messages")
    public ResponseEntity<List<ContactMessage>> getContactMessages(@RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(contactMessageRepository.findByStatusOrderByCreatedAtDesc(status));
        }
        return ResponseEntity.ok(contactMessageRepository.findAllByOrderByCreatedAtDesc());
    }

    @PutMapping("/admin/contact-messages/{id}/status")
    public ResponseEntity<?> updateContactMessageStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        if (newStatus == null || newStatus.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
        }

        Optional<ContactMessage> optMessage = contactMessageRepository.findById(id);
        if (optMessage.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ContactMessage message = optMessage.get();
        message.setStatus(newStatus);
        contactMessageRepository.save(message);

        return ResponseEntity.ok(message);
    }
}

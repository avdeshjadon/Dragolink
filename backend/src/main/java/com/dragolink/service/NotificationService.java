package com.dragolink.service;

import com.dragolink.dto.NotificationDto;
import com.dragolink.entity.Notification;
import com.dragolink.entity.User;
import com.dragolink.repository.NotificationRepository;
import com.dragolink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationDto> getNotifications(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAllAsRead(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        List<Notification> unread = notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(n -> !n.isRead())
                .collect(Collectors.toList());
        
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void deleteNotification(Long id, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Notification notification = notificationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
    }

    public void createNotification(User user, String type, String title, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    private NotificationDto mapToDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .time(getTimeAgo(notification.getCreatedAt()))
                .read(notification.isRead())
                .referenceId(notification.getReferenceId())
                .actionType(notification.getActionType())
                .build();
    }

    private String getTimeAgo(LocalDateTime createdAt) {
        if (createdAt == null) return "Just now";
        Duration duration = Duration.between(createdAt, LocalDateTime.now());
        long seconds = duration.getSeconds();
        
        if (seconds < 60) {
            return "Just now";
        } else if (seconds < 3600) {
            long mins = seconds / 60;
            return mins + (mins == 1 ? " minute ago" : " minutes ago");
        } else if (seconds < 86400) {
            long hours = seconds / 3600;
            return hours + (hours == 1 ? " hour ago" : " hours ago");
        } else {
            long days = seconds / 86400;
            return days + (days == 1 ? " day ago" : " days ago");
        }
    }
}

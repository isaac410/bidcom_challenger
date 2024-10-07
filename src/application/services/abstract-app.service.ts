import { Request } from 'express';

import { LinkTrackerDto } from '../dtos/link-tracker.dto';
import { CreateLinkTrackerDto } from '../dtos/create-link-tracker.dto';
import { IHealthStatus } from '../../domain/interfaces/health.interface';

export default abstract class AbstractAppService {
  /**
   * @description Retrieves the health status of the application.
   * This method returns an object containing a message indicating the application's status,
   * the current timestamp, and the uptime of the application in seconds.
   * @example const healthStatus = this.appService.getHealth();
   * @returns An object containing the health status of the application.
   * @returns {IHealthStatus} The health status object.
   * @returns {string} returns.message
   * @returns {number} returns.timestamp
   * @returns {number} returns.uptime
   */
  abstract getHealth(): IHealthStatus;

  /**
   * @description Creates a new link tracker based on the provided data transfer object.
   * This method takes a DTO containing the details of the link tracker to be created
   * and returns a DTO representing the created link tracker.
   * @param request the request is used to get the protocol and host in order to return the full url.
   *
   * @param createLinkTrackerDto The data transfer object containing the details for the new link tracker.
   * @example const newLinkTracker = await this.linkTrackerService.createLinkTracker({
   *   link: 'http://example.com',
   *   target: 'http://targetsite.com',
   *   valid: true,
   *   password: 'securepassword',
   *   expiration: new Date(Date.now() + 3600000), // 1 hour from now
   * });
   * @returns {LinkTrackerDto} The data transfer object representing the created link tracker.
   * @returns {string} returns.link
   * @returns {string} returns.target
   * @returns {boolean} returns.valid
   * @returns {string} returns.passwordapplicable).
   * @returns {Date} returns.expiration
   */
  abstract createLinkTracker(
    request: Request,
    createLinkTrackerDto: CreateLinkTrackerDto,
  ): Promise<LinkTrackerDto>;

  /**
   * @description Finds a LinkTracker by the provided link.
   * This method retrieves a LinkTracker object that corresponds to the specified link.
   * @example const linkTracker = await this.findLinkTrackerByLink(request, 'https://example.com');
   * @param {Request} request - The incoming request object.
   * @param {string} link - The link for which the LinkTracker is to be found.
   * @returns {Promise<LinkTrackerDto>} The LinkTracker object associated with the provided link.
   */
  abstract findLinkTrackerByLink(
    request: Request,
    link: string,
  ): Promise<LinkTrackerDto>;

  /**
   * @description Redirects the user to the specified link after validating the password.
   * This method returns an object containing the URL to which the user will be redirected.
   * @example const result = await this.redirect(request, 'https://example.com', 'yourPassword');
   * @param {Request} request - The incoming request object.
   * @param {string} link - The link to redirect to.
   * @param {string} password - The password to validate before redirection.
   * @returns {Promise<{ url: string }>} An object containing the URL for redirection.
   */
  abstract redirect(
    request: Request,
    link: string,
    password: string,
  ): Promise<{ url: string }>;

  /**
   * @description Updates a LinkTracker identified by its ID.
   * This method updates the details of a LinkTracker using the provided ID and DTO.
   * @example const updatedLinkTracker = await this.updateOneById('trackerId', createLinkTrackerDto);
   * @param {string} id - The ID of the LinkTracker to update.
   * @param {CreateLinkTrackerDto} dto - The data transfer object containing the updated LinkTracker details.
   * @returns {Promise<LinkTrackerDto>} The updated LinkTracker object.
   */
  abstract updateOneById(
    id: string,
    dto: CreateLinkTrackerDto,
  ): Promise<LinkTrackerDto>;

  /**
   * @description Retrieves all LinkTrackers.
   * This method returns an array of LinkTracker objects.
   * @example const allLinkTrackers = await this.findAll();
   * @returns {Promise<LinkTrackerDto[]>} An array of LinkTracker objects.
   */
  abstract findAll(): Promise<LinkTrackerDto[]>;

  /**
   * @description Retrieves statistics for a specific link.
   * This method returns the number of times the specified link has been visited.
   * @example const stats = await this.getStatsByLink(request, 'https://example.com');
   * @param {Request} request - The incoming request object.
   * @param {string} link - The link for which statistics are to be retrieved.
   * @returns {Promise<{ visited: number }>} An object containing the number of visits for the specified link.
   */
  abstract getStatsByLink(
    request: Request,
    link: string,
  ): Promise<{ visited: number }>;

  /**
   * @description Marks a LinkTracker as invalid by the provided link.
   * This method updates the status of a LinkTracker associated with the specified link to invalid.
   * @example const invalidatedLinkTracker = await this.invalidLinkTrackerByLink(request, 'https://example.com');
   * @param {Request} request - The incoming request object.
   * @param {string} link - The link for which the LinkTracker is to be marked invalid.
   * @returns {Promise<LinkTrackerDto>} The updated LinkTracker object marked as invalid.
   */
  abstract invalidLinkTrackerByLink(
    request: Request,
    link: string,
  ): Promise<LinkTrackerDto>;
}
